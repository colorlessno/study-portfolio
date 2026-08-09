from __future__ import annotations

from fnmatch import fnmatch
from pathlib import Path

from studyai.common.errors.models import AppError, ValidationAppError


class MCPFilesystemClient:
    SUPPORTED_EXTENSIONS = {
        ".pdf",
        ".docx",
        ".xlsx",
        ".pptx",
        ".txt",
        ".md",
        ".py",
        ".js",
        ".ts",
        ".java",
        ".sql",
        ".sh",
        ".yaml",
        ".yml",
        ".json",
        ".xml",
    }

    def list_files(self, target_paths: list[str], exclude_patterns: list[str]) -> list[Path]:
        if not target_paths:
            raise ValidationAppError("invalid_scan_targets", "scan_targets は1件以上必要です。")
        results: list[Path] = []
        for raw_path in target_paths:
            path = Path(raw_path)
            if not path.is_absolute():
                raise AppError("path_out_of_scope", "絶対パスのみスキャンできます。", 403, {"path": raw_path})
            if not path.exists():
                continue
            if path.is_file():
                if self._is_target_file(path, exclude_patterns):
                    results.append(path)
                continue
            for file_path in path.rglob("*"):
                if file_path.is_file() and self._is_target_file(file_path, exclude_patterns):
                    results.append(file_path)
        return sorted(results, key=lambda item: str(item).lower())

    def _is_target_file(self, file_path: Path, exclude_patterns: list[str]) -> bool:
        suffix = file_path.suffix.lower()
        if suffix not in self.SUPPORTED_EXTENSIONS:
            return False
        full_path = str(file_path).replace("\\", "/")
        for pattern in exclude_patterns:
            normalized = pattern.replace("\\", "/")
            if fnmatch(full_path, normalized) or any(part == normalized for part in file_path.parts):
                return False
        return True
