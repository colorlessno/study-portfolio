# プロンプト検証スクリプトの使い方

## 1. API接続なしで確認する

`StudyAIIdeaGeneration` ディレクトリから実行する。

```cmd
python verify\verify_prompts.py --check-only
python -m unittest discover -s verify -p "test_*.py"
```

`--check-only` はLM Studioへ接続せず、入力JSONの必須項目、5つのpromptのplaceholderと必須sectionを確認する。単体テストではJSON抽出、step指定、validatorも確認する。

## 2. Local Serverへの接続だけを確認する

LM Studioのアプリ起動だけではAPIは待受状態にならない。モデルをロードし、Local Server画面でserverを開始してから実行する。既定の接続先は `http://localhost:1234/v1` である。別portを使う場合は `--base-url` で指定する。

```cmd
python verify\verify_prompts.py --connection-only
python verify\verify_prompts.py --connection-only --base-url http://localhost:5858/v1
```

接続先とロード済みmodelを表示して終了し、生成処理と結果保存は行わない。

## 3. LM Studioで生成結果を確認する

```cmd
python verify\verify_prompts.py
```

5つのpromptを `mindmap → scamper → persona → six_hats → reverse_plan` の順に連結し、JSON妥当性・件数・所要時間・token数を自動確認する。`six_hats` と `reverse_plan` は、persona平均scoreが最高の1案だけで検証する。

結果は `verify\results\<日時>\report.md` に保存される。生成結果はGit管理対象外である。WARNまたはNGのときは同じディレクトリの `*_raw.txt` を確認する。

## 主なオプション

```cmd
python verify\verify_prompts.py --check-only --input exercise\baseline_input.json
python verify\verify_prompts.py --connection-only --base-url http://localhost:5858/v1
python verify\verify_prompts.py --input exercise\baseline_input.json --steps mindmap,scamper
python verify\verify_prompts.py --steps mindmap,scamper     … 最初の2本だけ試す
python verify\verify_prompts.py --model "モデル名"          … モデル指定(既定: ロード済み先頭)
python verify\verify_prompts.py --temperature 0.4           … JSONが壊れるとき下げる
python verify\verify_prompts.py --max-tokens 16384          … 出力が途中で切れるとき増やす
python verify\verify_prompts.py --timeout 1200              … 1呼び出しの上限秒(既定600)
```

既定入力は `verify\test_input.json` である。入力比較の演習では、既定値を直接書き換えず `exercise\baseline_input.json` と `exercise\variant_input.json` を使う。

## 判定の見方と対処

- OK: JSONと期待構造が一致
- WARN: JSONは取れたが件数・形式に差異 → temperatureを下げる / モデル変更 / それでもダメなら件数削減を検討
- NG: JSON取得失敗 → max_tokens増、temperature 0.4、別モデルの順に試す

結果を比較するときは `exercise\comparison_template.md` に予想、観察、差分、説明を記録する。
