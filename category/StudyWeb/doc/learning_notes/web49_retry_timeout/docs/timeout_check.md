# Timeout Check

serverのslow modeは2秒後に200を返す。

```powershell
curl.exe --max-time 1 -i "http://localhost:3049/?mode=slow"
```

clientは1秒で待機を終了するため、responseを受け取れない。

比較:

```powershell
curl.exe --max-time 3 -i "http://localhost:3049/?mode=slow"
```

3秒上限なら2秒後の200を受け取れる。

## 観察項目

- clientが待った時間
- timeout errorの種類
- server側処理がclient切断後も続くか
- retryした場合の総処理時間
- 操作が重複実行される可能性

timeoutは失敗をなくす設定ではなく、待ち続ける時間を制限してresourceを解放し、次の判断へ進むための設定。
