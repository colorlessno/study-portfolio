# プロンプト検証スクリプトの使い方

LM Studio を起動しモデルをロードした状態で、コマンドプロンプトから:

```bat
cd .
python verify\verify_prompts.py
```

5プロンプトをワークフロー順(mindmap → scamper → persona → six_hats → reverse_plan)に連結実行し、
JSON妥当性・件数・所要時間・トークン数を自動チェックする。
six_hats / reverse_plan はペルソナ平均スコア最高の1案のみで検証(時間短縮のため)。

結果は `verify\results\<日時>\report.md` に保存される。WARN/NG時は同フォルダの `*_raw.txt` を確認。

## 主なオプション

```bat
python verify\verify_prompts.py --steps mindmap,scamper     … 最初の2本だけ試す
python verify\verify_prompts.py --model "モデル名"          … モデル指定(既定: ロード済み先頭)
python verify\verify_prompts.py --temperature 0.4           … JSONが壊れるとき下げる
python verify\verify_prompts.py --max-tokens 16384          … 出力が途中で切れるとき増やす
python verify\verify_prompts.py --timeout 1200              … 1呼び出しの上限秒(既定600)
```

テスト用のテーマ・制約は `verify\test_input.json` を編集して変更できる。

## 判定の見方と対処

- OK: 合格
- WARN: JSONは取れたが件数・形式に差異 → temperatureを下げる / モデル変更 / それでもダメなら件数削減を検討
- NG: JSON取得失敗 → max_tokens増、temperature 0.4、別モデルの順に試す

判定が出たら `report.md` を共有してもらえれば、結果を設計書v4に反映する。
