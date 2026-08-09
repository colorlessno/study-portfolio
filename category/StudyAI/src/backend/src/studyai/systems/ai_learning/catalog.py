from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class LearningSystem:
    system_id: str
    title: str
    category: str
    default_input: dict
    observation_hint: str


SYSTEMS: dict[str, LearningSystem] = {
    "system17": LearningSystem(
        "system17",
        "Tokenizer observation",
        "tokenizer",
        {"text": "注文キャンセルの締切はいつですか？\nOrder cancellation deadline?", "context_limit": 32},
        "Compare character count and estimated token count.",
    ),
    "system18": LearningSystem(
        "system18",
        "Embedding similarity search",
        "embedding",
        {
            "query": "返品したい",
            "documents": ["返品方法を知りたい", "配送状況を確認したい", "請求書を再発行したい"],
            "top_k": 3,
        },
        "Short lexical vectors are used as a local substitute for embeddings.",
    ),
    "system19": LearningSystem(
        "system19",
        "Attention demo",
        "attention",
        {"sentence": "顧客は注文をキャンセルしたが、理由は配送遅延だった。", "focus_token_index": 2},
        "A small co-occurrence matrix is used to visualize token relations.",
    ),
    "system20": LearningSystem(
        "system20",
        "Context window experiment",
        "context",
        {"text": "重要: 返金期限は7日です。" * 12, "context_limit": 40, "important_marker": "返金期限"},
        "Show what remains when the estimated context limit is applied.",
    ),
    "system21": LearningSystem(
        "system21",
        "Temperature comparison",
        "generation",
        {"prompt": "問い合わせへの返信文を作る", "temperatures": [0.1, 0.7], "trial_count": 3},
        "Mock generations vary deterministically by temperature.",
    ),
    "system22": LearningSystem(
        "system22",
        "RAG chunk size comparison",
        "chunking",
        {"document": "返品規定。返金条件。配送規定。問い合わせ窓口。", "chunk_size": 12, "overlap": 3},
        "Chunk size and overlap are compared using local text splitting.",
    ),
    "system23": LearningSystem(
        "system23",
        "Reranker comparison",
        "reranker",
        {"query": "返金条件", "candidates": ["配送条件", "返金条件は7日以内", "会員登録"]},
        "Initial lexical ranking is re-ranked by exact phrase bonus.",
    ),
    "system24": LearningSystem(
        "system24",
        "Multi model comparison",
        "model_compare",
        {"prompt": "FAQ回答を作成", "models": ["small-local", "balanced-local", "strict-mock"]},
        "Model profiles are compared by mock quality, latency, and cost scores.",
    ),
    "system25": LearningSystem(
        "system25",
        "max_tokens / temperature comparison",
        "output_control",
        {"prompt": "返品手順を説明", "max_tokens_values": [20, 60], "temperatures": [0.2, 0.8]},
        "Output length and variation are compared by configuration matrix.",
    ),
    "system26": LearningSystem(
        "system26",
        "Quantization comparison",
        "quantization",
        {"profiles": ["Q4", "Q5", "Q8"], "prompt": "要約してください"},
        "Quantization trade-offs are represented as local profile metrics.",
    ),
    "system27": LearningSystem(
        "system27",
        "VLM image size accuracy",
        "vlm",
        {"image_variants": [{"name": "small", "width": 320}, {"name": "large", "width": 1280}], "expected_points": 5},
        "Image-size accuracy is estimated without external VLM calls.",
    ),
    "system28": LearningSystem(
        "system28",
        "OCR result normalization",
        "ocr_normalize",
        {"ocr_text": "TEL O3-1234-５６７８  返品　期限", "rules": ["space", "zenkaku", "ocr_o_zero"]},
        "Normalize common OCR spacing and character confusions.",
    ),
    "system29": LearningSystem(
        "system29",
        "Chunk metadata design",
        "metadata",
        {"document": "返品規定\n第1章 条件", "metadata": {"source": "policy.md", "page": 1, "permission": "public"}},
        "Attach traceable metadata to chunks.",
    ),
    "system30": LearningSystem(
        "system30",
        "Duplicate document detection",
        "duplicate",
        {"documents": ["返品条件は7日以内", "返品条件は七日以内", "配送条件は3日"]},
        "Detect exact and near duplicates with local similarity.",
    ),
    "system31": LearningSystem(
        "system31",
        "Ground truth creation",
        "ground_truth",
        {"question": "返品期限は？", "expected_answer": "7日以内", "evidence": ["返品条件は7日以内"]},
        "Create one fixed evaluation case.",
    ),
    "system32": LearningSystem(
        "system32",
        "RAG evaluation set",
        "rag_eval",
        {"cases": [{"question": "返品期限は？", "expected": "7日以内"}], "run_label": "baseline"},
        "Run a tiny RAG evaluation set locally.",
    ),
    "system33": LearningSystem(
        "system33",
        "Retrieval evaluation",
        "retrieval_eval",
        {"expected_evidence": ["doc-1"], "retrieval_results": ["doc-1", "doc-3", "doc-2"]},
        "Calculate hit and recall style metrics.",
    ),
    "system34": LearningSystem(
        "system34",
        "Answer evaluation",
        "answer_eval",
        {"expected_answer": "7日以内", "generated_answer": "返品は7日以内に可能です", "evidence": ["返品条件は7日以内"]},
        "Score correctness and groundedness.",
    ),
    "system35": LearningSystem(
        "system35",
        "Prompt A/B comparison",
        "prompt_ab",
        {"prompt_a": "短く答える", "prompt_b": "根拠付きで答える", "cases": ["返品期限"]},
        "Compare two prompt variants by deterministic scores.",
    ),
    "system36": LearningSystem(
        "system36",
        "Trace storage",
        "trace",
        {"user_input": "返品期限は？", "retrieved_context": ["返品条件は7日以内"], "output": "7日以内です"},
        "Save a trace-shaped record for reproducibility.",
    ),
}

