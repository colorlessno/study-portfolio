from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEARNING_NOTES = ROOT / "doc" / "learning_notes"

COURSES = {
    "arch01": {
        "directory": "arch01_system_anatomy_walkthrough",
        "required_sections": ["## 15分で再開する", "## 学習順", "## 説明演習", "## 完了条件"],
        "required_docs": [
            "target_system_summary.md",
            "context_container_component.md",
            "request_data_flow.md",
            "failure_mode.md",
            "evidence_vs_inference.md",
            "decision_notes.md",
            "example_devops07_system_anatomy.md",
        ],
        "example_sections": ["## Context", "## Container", "## Component", "## 失敗mode", "## 証拠と推測"],
        "example_file": "example_devops07_system_anatomy.md",
    },
    "arch02": {
        "directory": "arch02_evidence_driven_design_review",
        "required_sections": ["## 15分で再開する", "## 学習順", "## 説明演習", "## 完了条件"],
        "required_docs": [
            "review_target.md",
            "evidence_checklist.md",
            "evidence_mapping.md",
            "findings.md",
            "residual_risk.md",
            "review_result_template.md",
            "example_devops07_design_review.md",
        ],
        "example_sections": ["## review対象", "## 証拠checklist", "## 証拠mapping", "## 指摘", "## 残リスク", "## review結果"],
        "example_file": "example_devops07_design_review.md",
    },
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def validate_course(course_id: str, config: dict[str, object]) -> None:
    course_dir = LEARNING_NOTES / str(config["directory"])
    readme = course_dir / "README.md"
    require(readme.is_file(), f"{course_id}: README.md is missing")
    readme_text = readme.read_text(encoding="utf-8")
    for section in config["required_sections"]:
        require(str(section) in readme_text, f"{course_id}: missing section {section}")

    docs_dir = course_dir / "docs"
    for file_name in config["required_docs"]:
        path = docs_dir / str(file_name)
        require(path.is_file(), f"{course_id}: missing learning artifact {file_name}")
        require(path.read_text(encoding="utf-8").strip(), f"{course_id}: empty learning artifact {file_name}")

    example_path = docs_dir / str(config["example_file"])
    example_text = example_path.read_text(encoding="utf-8")
    for section in config["example_sections"]:
        require(str(section) in example_text, f"{course_id}: example is missing section {section}")


def main() -> int:
    for course_id, config in COURSES.items():
        validate_course(course_id, config)
        print(f"PASS {course_id}: learning path and example artifacts")
    print("StudyArchitecture learning validation passed: arch01, arch02")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
