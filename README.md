🔗 Demo: https://dayfolio.vercel.app/

# Dayfolio

複数のカレンダー（予定管理・筋トレ・学習）を切り替えて、
日々のログを一元管理できる Web アプリです。

## Features
- 複数カレンダーの切り替え（予定 / 筋トレ / 学習）
- ログの作成・編集・削除（CRUD）
- カレンダー種別ごとに異なる入力 UI
- localStorage によるデータ永続化
- 初期ロードと保存処理の安全な制御（useEffect）

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- react-big-calendar
- date-fns
- Radix UI

## Design / Implementation Notes
- calendarId を discriminated union として扱い、型安全に分岐
- UIと状態管理・ロジックを完全に分離し、page.tsxを宣言的な状態に維持
- localStorage 読み込み・保存処理を lib に切り出し
- 初期レンダリング時の上書きバグを防ぐガードを実装

## Future Improvements
- データのバックエンド永続化（DB / API）
- カレンダーの追加・並び替え
- グラフ表示（筋トレ・学習ログの可視化）
