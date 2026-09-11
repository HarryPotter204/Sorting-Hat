# 掲示板自動投稿（Announcement Automation）

管理ページから ON/OFF できる、掲示板（`announcements` コレクション）への自動定期投稿機能の設計・運用ドキュメントです。

## 仕組み

```
[管理画面 /admin/announcements]
        │  ON/OFF（requireAdmin 保護 API）
        ▼
[Firestore: settings/announcementAutomation]
        │  enabled / nextRunAt / lastRunAt ...
        ▼
[tick（毎分）] ── now >= nextRunAt のときだけ投稿
        │                         （5〜10分のランダム間隔で nextRunAt を前進）
        ▼
[Firestore: announcements]  ← 既存の掲示板・組分け速報と同じコレクション
```

- **実行ドライバーは2系統あり、併用可能**（重複は二重の防御で自動排除）:
  1. **サーバー内スケジューラー**（`src/instrumentation.ts`）: サーバープロセス起動時に60秒間隔のタイマーを開始。Firebase App Hosting（Cloud Run）で追加料金なしで動作。
  2. **Cloud Scheduler → tick API**（任意）: インスタンスがゼロにスケールしても確実に毎分実行したい場合に設定。
- **投稿間隔**: 毎回 5〜10分のランダム値（例: 5分 → 8分 → 6分 → 10分）。
- **重複防止**:
  1. Firestore トランザクションで `nextRunAt` を楽観ロック的に前進させる（二重起動しても1回しか投稿を認めない）。
  2. 投稿ドキュメント ID を「現在の分」から決定的に生成（`anno_auto_<分バケット>`）し、`create()` の一意制約で二重防御。
- **組分け速報との区別**: 自動投稿は `isSortingNotice: false` + `isAutoNotice: true`。既存の `anno_sorting_*` / 組分け速報ロジックには一切触れません。

## Firestore ドキュメント

`settings/announcementAutomation`:

```text
enabled:    boolean        // ON/OFF
updatedAt:  timestamp      // 最終更新
updatedBy:  string         // 更新者（"admin"）
lastRunAt:  timestamp      // 最終自動投稿日時
nextRunAt:  timestamp      // 次回予定時刻（OFFの間は削除される）
lastPostId: string         // 最後に投稿したドキュメントID
```

## API

| エンドポイント | メソッド | 認証 | 用途 |
| --- | --- | --- | --- |
| `/api/announcements/automation` | GET | 管理者セッションCookie | 現在の設定取得 |
| `/api/announcements/automation` | POST | 管理者セッションCookie | ON/OFF 切り替え（`{ enabled: boolean }`） |
| `/api/announcements/automation/tick` | GET | `x-automation-key` ヘッダー（共有シークレット） | スケジューラー用 tick |

- ON/OFF API は既存の `requireAdmin()`（HMAC署名付きセッションCookie）で保護されており、管理者以外は 401 になります。
- クライアントが Firestore に直接書き込むことはありません（既存の Admin SDK パターンに準拠）。
- tick API は `ANNOUNCEMENT_AUTOMATION_TICK_SECRET` が設定されていない場合、常に 401 を返します（無効化状態）。

## 環境変数（tick API を使う場合のみ）

`apphosting.yaml` または Firebase コンソールのシークレットに追加:

```yaml
- variable: ANNOUNCEMENT_AUTOMATION_TICK_SECRET
  value: <ランダムな長い文字列>
  availability:
    - RUNTIME
```

任意: サーバー内タイマーを無効化して Cloud Scheduler のみにする場合:

```yaml
- variable: ANNOUNCEMENT_AUTOMATION_INPROCESS
  value: "off"
  availability:
    - RUNTIME
```

## Cloud Scheduler の設定（任意・24/7保証が必要な場合）

サーバー内タイマーはプロセスが生きている間のみ動作します。App Hosting のインスタンスはアイドル時にスケールダウンする可能性があるため、確実な定期実行には Cloud Scheduler を推奨します（毎分1回、無料枠内で収まります）。

```bash
# 1. シークレットを作成（例）
openssl rand -hex 32

# 2. App Hosting の環境変数に ANNOUNCEMENT_AUTOMATION_TICK_SECRET を設定し、デプロイ

# 3. Cloud Scheduler ジョブを作成
gcloud scheduler jobs create http announcement-automation-tick \
  --location=asia-northeast1 \
  --schedule="* * * * *" \
  --uri="https://<あなたのバックエンドURL>/api/announcements/automation/tick" \
  --http-method=GET \
  --headers="x-automation-key=<上記のシークレット>"
```

バックエンドURLは `firebase apphosting:backends:list` で確認できます。

## テストの分け方

- **ローカル（`npm run dev`）**: 管理画面の ON/OFF、Firestore への保存、リロード後の状態維持、tick API の認証（401/200）を確認できる。投稿そのものは `nextRunAt` 経過後（ON直後の最初のtick、または5〜10分後）に確認。
- **本番スケジューラー**: Cloud Scheduler 設定後に、5〜10分間隔の実際の定期投稿を確認。

## 失敗時の影響

自動投稿はすべて try/catch で保護され、失敗しても診断・組み分け結果・結果ページ・通常の掲示板表示には影響しません。サーバー内タイマーの例外はログに記録されるだけで、サーバーは継続動作します。