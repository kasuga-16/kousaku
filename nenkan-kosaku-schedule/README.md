# 年間耕作スケジュール

作物ごとの年間農作業スケジュールをガントチャートで確認できるアプリ（デモデータ版）。

## 画面
- スケジュール画面（`components/ScheduleApp.jsx` の `GanttScreen`）：月単位のガントチャート。横スクロールで全月・作業名を確認可能。
- 詳細画面（`DetailScreen`）：作業をタップすると肥料・薬剤／必要資材の一覧を表示。
- 作付け図画面（`PlantingScreen`）：作物名をタップすると圃場ブロックの作付け状況を表示。

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:3000` で確認できます。

## Vercelへのデプロイ
1. このリポジトリをGitHubにpush
2. Vercelで「Import Project」からリポジトリを選択（Next.jsは自動検出されます）
3. そのままデプロイでOK（環境変数は不要）

## 今後の予定（Upstash移行）
現在はすべて `components/ScheduleApp.jsx` 内のデモデータ（`CROPS` / `TASKS` / `FIELD_BLOCKS`）で動作しています。
本番データに切り替える際は、これらの配列をUpstash（Redis）からのfetch結果に置き換える想定です。
