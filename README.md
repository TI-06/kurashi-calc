# くらし算

暮らしに必要な量と費用を、家族人数や日数から計算するWebサイトです。

## 現在の実装

- 承認済みトップLPデザイン
- 実動する家族のお米計算
- PC・タブレット・スマートフォン対応
- 人気ツール、カテゴリ、使い方、信頼性、記事カード
- AdSense用プレースホルダー
- SEO基本設定、robots.txt、sitemap.xml
- Cloudflare Workers Static Assets設定

## ローカル確認

Node.js 22.16以上を使用します。

```bash
npm test
npm run serve
```

ブラウザで `http://localhost:4173` を開きます。

## Cloudflare公開

### GitHub連携

1. このリポジトリをGitHubへpushします。
2. Cloudflare Dashboardの **Workers & Pages** を開きます。
3. **Create application** → **Import a repository** を選択します。
4. GitHubの対象リポジトリを選択します。
5. Worker名を `kurashi-calc` にします。`wrangler.jsonc` の `name` と一致させてください。
6. Build commandは空欄、Deploy commandは `npx wrangler deploy` を指定します。
7. Production branchは `main` を指定します。

### 手動公開

```bash
npm run deploy
```

## 公開前に変更する項目

- `public/index.html` のcanonical、OG URL、問い合わせメール
- `public/robots.txt` と `public/sitemap.xml` の公開ドメイン
- `wrangler.jsonc` のWorker名（GitHub側の名称を変える場合）
- 本番AdSense審査後の広告コード

## お米計算の基準

- 茶碗1杯（炊いたご飯約150g）を生米65gとして計算
- 初期設定は1人1日1.5杯
- 必要量: 家族人数 × 1人1日の杯数 × 日数 × 65g
- 5kg袋数: 必要量を5kgで割り切り上げ
- 購入費用: 5kg袋数 × 入力した5kg価格
- 5kg価格の初期値: 3,373円（税込）
- 価格参照: 農林水産省 2026年7月24日公表、2026年7月13日〜19日の全国スーパー平均

計算ロジックは `public/assets/rice-calculator.js` に分離し、Node.js標準テストで検証しています。
