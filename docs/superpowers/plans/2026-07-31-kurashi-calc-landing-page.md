# くらし算 Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 承認済みモックアップを再現した、実動するお米計算付きトップLPをCloudflare Workers Static Assetsへ公開できる状態にする。

**Architecture:** 依存を最小化した静的HTML/CSS/JavaScript構成とする。計算ロジックはUIから分離したES Moduleとして実装し、Node.js標準テストランナーで検証する。Cloudflareは`public`ディレクトリを静的配信する。

**Tech Stack:** HTML5, CSS3, JavaScript ES Modules, Node.js 22 test runner, Cloudflare Workers Static Assets, Wrangler

## Global Constraints

- 外部フォント・外部画像へ依存しない。
- 360px以上の幅で操作可能にする。
- お米計算式は承認済み仕様どおりにする。
- 広告枠は操作要素から明確に分離する。
- 初回はDB・会員機能・本番広告コードを実装しない。

---

### Task 1: お米計算ドメイン

**Files:**
- Create: `public/assets/rice-calculator.js`
- Test: `tests/rice-calculator.test.js`

**Interfaces:**
- Produces: `calculateRice(input)`、`clampCount(value)`、`formatYen(value)`

- [x] テストに初期条件、端数、人数境界、通貨表記を記述する。
- [x] `node --test tests/rice-calculator.test.js`を実行し、モジュール未実装で失敗することを確認する。
- [x] 最小実装を追加する。
- [x] テストがすべて成功することを確認する。

### Task 2: LP構造とデザイン

**Files:**
- Create: `public/index.html`
- Create: `public/assets/styles.css`
- Create: `public/assets/icons.svg`
- Create: `public/assets/articles/*.svg`
- Test: `tests/landing-page.test.js`

**Interfaces:**
- Consumes: `public/assets/app.js`
- Produces: セマンティックなトップLP、全セクションのアンカー

- [x] 必須ランドマークとフォーム要素を確認する失敗テストを作る。
- [x] テストがHTML未実装で失敗することを確認する。
- [x] モックアップに合わせたHTML、SVG、CSSを作成する。
- [x] 360px、768px、1180pxのレスポンシブ規則を定義する。
- [x] 構造テストを成功させる。

### Task 3: 計算UIとモバイル操作

**Files:**
- Create: `public/assets/app.js`
- Create: `public/assets/ui-helpers.js`
- Test: `tests/ui-helpers.test.js`

**Interfaces:**
- Consumes: `calculateRice(input)`、`clampCount(value)`、`formatYen(value)`
- Produces: カウンター操作、再計算、結果表示、モバイルメニュー

- [x] 公開用計算モジュールの挙動テストを先に作成する。
- [x] 未実装で失敗することを確認する。
- [x] DOMイベントを接続し、初期表示から結果を描画する。
- [x] 結果領域を`aria-live`で更新する。
- [x] テストを成功させる。

### Task 4: 公開設定とSEO

**Files:**
- Create: `package.json`
- Create: `wrangler.jsonc`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Create: `public/_headers`
- Create: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Produces: `npm test`、`npm run serve`、`npx wrangler deploy`

- [x] package scriptsとCloudflare Static Assets設定を追加する。
- [x] セキュリティヘッダー、robots、sitemapを追加する。
- [x] GitHub・Cloudflare接続手順をREADMEに記載する。

### Task 5: 統合検証

**Files:**
- Verify: all files

- [x] `npm test`を実行する。
- [x] ローカルHTTPサーバーを起動し、主要ファイルが200で返ることを確認する。
- [x] ChromiumでPC幅とスマートフォン幅のスクリーンショットを取得する。
- [x] コンソールエラーがないことを確認する。
- [x] Git差分を確認し、成果物をZIP化する。
