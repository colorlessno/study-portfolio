from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest
from pydantic import ValidationError

from studyai.systems.system11.schemas.organizer import SettingsRequest
from studyai.systems.system11.services.execution_service import ExecutionService
from studyai.systems.system11.services.path_safety_service import PathSafetyService
from studyai.systems.system11.services.rollback_service import RollbackService
from studyai.systems.system11.services.scan_service import ScanService


# ---------- PathSafetyService ----------

class TestPathSafetyService:
    def setup_method(self):
        self.service = PathSafetyService()

    def test_forbidden_extension(self):
        assert self.service.is_forbidden_extension(Path("C:/foo/bar.exe")) is True
        assert self.service.is_forbidden_extension(Path("C:/foo/bar.bat")) is True
        assert self.service.is_forbidden_extension(Path("C:/foo/bar.pdf")) is False

    def test_validate_scope_allowed(self, tmp_path):
        target = tmp_path / "sub" / "file.txt"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.touch()
        # should not raise
        self.service.validate_scope(target.resolve(), [tmp_path.resolve()])

    def test_validate_scope_denied(self, tmp_path):
        from studyai.common.errors.models import AppError
        other = Path(tempfile.mkdtemp())
        target = other / "file.txt"
        target.touch()
        with pytest.raises(AppError) as exc_info:
            self.service.validate_scope(target.resolve(), [tmp_path.resolve()])
        assert exc_info.value.error_code == "unsafe_path_detected"

    def test_matches_exclude(self, tmp_path):
        file_path = tmp_path / "node_modules" / "package.json"
        assert self.service.matches_exclude(file_path, ["node_modules"]) is True
        assert self.service.matches_exclude(file_path, [".git"]) is False


# ---------- ScanService ----------

class TestScanService:
    def setup_method(self):
        self.service = ScanService()

    def test_collect_files_basic(self, tmp_path):
        (tmp_path / "a.txt").write_text("hello")
        (tmp_path / "b.py").write_text("print(1)")
        results = self.service.collect_files([str(tmp_path)], [])
        assert len(results) == 2
        paths = [r["path"] for r in results]
        assert any("a.txt" in p for p in paths)
        assert any("b.py" in p for p in paths)

    def test_collect_files_excludes(self, tmp_path):
        (tmp_path / "keep.txt").write_text("keep")
        (tmp_path / "skip.log").write_text("skip")
        results = self.service.collect_files([str(tmp_path)], ["*.log"])
        assert all("skip.log" not in r["path"] for r in results)

    def test_collect_files_forbidden_extension(self, tmp_path):
        (tmp_path / "setup.exe").write_bytes(b"MZ")
        results = self.service.collect_files([str(tmp_path)], [])
        exe_results = [r for r in results if r["path"].endswith(".exe")]
        assert all(r["is_forbidden"] for r in exe_results)


# ---------- ExecutionService ----------

class TestExecutionService:
    def setup_method(self):
        self.service = ExecutionService()

    def test_execute_move_success(self, tmp_path):
        src = tmp_path / "source.txt"
        src.write_text("content")
        dest = tmp_path / "dest" / "source.txt"
        action = {
            "action_id": "act1",
            "action_type": "move",
            "source_path": str(src),
            "dest_path": str(dest),
        }
        results = self.service.execute_actions([action], [tmp_path.resolve()])
        assert results[0]["status"] == "success"
        assert dest.exists()
        assert not src.exists()

    def test_execute_move_conflict(self, tmp_path):
        src = tmp_path / "source.txt"
        src.write_text("content")
        dest = tmp_path / "dest.txt"
        dest.write_text("existing")
        action = {
            "action_id": "act2",
            "action_type": "move",
            "source_path": str(src),
            "dest_path": str(dest),
        }
        results = self.service.execute_actions([action], [tmp_path.resolve()])
        assert results[0]["status"] == "conflict"
        assert results[0]["error_code"] == "name_conflict"

    def test_execute_rename_success(self, tmp_path):
        src = tmp_path / "old_name.txt"
        src.write_text("content")
        action = {
            "action_id": "act3",
            "action_type": "rename",
            "source_path": str(src),
            "new_name": "new_name.txt",
        }
        results = self.service.execute_actions([action], [tmp_path.resolve()])
        assert results[0]["status"] == "success"
        assert (tmp_path / "new_name.txt").exists()

    def test_execute_keep_skipped(self, tmp_path):
        src = tmp_path / "file.txt"
        src.write_text("x")
        action = {
            "action_id": "act4",
            "action_type": "keep",
            "source_path": str(src),
        }
        results = self.service.execute_actions([action], [tmp_path.resolve()])
        assert results[0]["status"] == "skipped_by_policy"

    def test_execute_forbidden_extension_skipped(self, tmp_path):
        src = tmp_path / "setup.exe"
        src.write_bytes(b"MZ")
        action = {
            "action_id": "act5",
            "action_type": "move",
            "source_path": str(src),
            "dest_path": str(tmp_path / "dest" / "setup.exe"),
        }
        results = self.service.execute_actions([action], [tmp_path.resolve()])
        assert results[0]["status"] == "skipped_by_policy"
        assert results[0]["error_code"] == "forbidden_extension"


# ---------- RollbackService ----------

class TestRollbackService:
    def setup_method(self):
        self.service = RollbackService()

    def test_rollback_move(self, tmp_path):
        original = tmp_path / "original.txt"
        moved = tmp_path / "moved.txt"
        moved.write_text("content")

        rollback_data = [{
            "action_id": "act1",
            "action_type": "move",
            "source_path": str(original),
            "target_path": str(moved),
        }]
        results = self.service.rollback_items(rollback_data, allowed_roots=[tmp_path.resolve()])
        assert results[0]["status"] == "reverted"
        assert original.exists()
        assert not moved.exists()

    def test_rollback_target_not_found(self, tmp_path):
        rollback_data = [{
            "action_id": "act2",
            "action_type": "move",
            "source_path": str(tmp_path / "original.txt"),
            "target_path": str(tmp_path / "nonexistent.txt"),
        }]
        results = self.service.rollback_items(rollback_data, allowed_roots=[tmp_path.resolve()])
        assert results[0]["error_code"] == "target_not_found"


# ---------- Schema ----------

class TestSettingsSchema:
    def test_settings_request_accepts_known_schedule(self):
        req = SettingsRequest(schedule="daily")
        assert req.schedule == "daily"

    def test_settings_request_rejects_unknown_schedule(self):
        with pytest.raises(ValidationError):
            SettingsRequest(schedule="hourly")
