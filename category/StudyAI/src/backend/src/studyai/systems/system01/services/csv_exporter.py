from __future__ import annotations

import csv
from io import StringIO

from studyai.systems.system01.schemas.extract import DocumentListResponse


class CSVExporter:
    HEADERS = [
        "文書ID",
        "ファイル名",
        "文書種別",
        "発行日",
        "取引先名",
        "合計金額",
        "信頼度スコア",
        "要確認フラグ",
        "登録日時",
    ]

    def export(self, documents: DocumentListResponse) -> str:
        buffer = StringIO()
        writer = csv.writer(buffer)
        writer.writerow(self.HEADERS)
        for item in documents.items:
            writer.writerow(
                [
                    item.document_id,
                    item.file_name,
                    item.document_type,
                    item.issue_date,
                    item.supplier_name,
                    item.total,
                    item.confidence_score,
                    item.requires_review,
                    item.created_at.isoformat(),
                ]
            )
        return buffer.getvalue()
