# くらし算

暮らしに必要な量と費用を、家族人数や日数などの条件から計算する静的Webサイトです。計算式・初期値・参照元を各ページで公開し、Cloudflare Workers Static Assetsで配信します。

## 実装済み

- 家族のお米必要量・購入費用
- 家電の電気代
- 家庭用プールの水量・上下水道代
- 防災備蓄の水・食事・携帯トイレ・トイレットペーパー・カセットボンベ
- ツール一覧、カテゴリ、サイト内検索
- 根拠付き解説記事4本
- 運営者情報、使い方、お問い合わせ、利用規約、プライバシーポリシー
- AdSense用プレースホルダー
- sitemap.xml、robots.txt、canonical、OGP、構造化データ
- PC・タブレット・スマートフォン対応

## ローカル確認

Node.js 22.16以上を使用します。

```bash
npm run check
npm run serve
```

ブラウザで `http://localhost:4173` を開きます。Cloudflare互換のローカル確認は次のコマンドです。

```bash
npx wrangler dev
```

## Cloudflare公開

1. Cloudflare Dashboardの **Workers & Pages** を開きます。
2. **Create application** → **Import a repository** を選択します。
3. `TI-06/kurashi-calc`を選択します。
4. Worker名を`kurashi-calc`にします。
5. Production branchを`main`にします。
6. Build commandは空欄、Deploy commandは`npx wrangler deploy`にします。

手動公開は次のコマンドです。

```bash
npm run deploy
```

## 主な初期値

| 計算 | 初期値 | 参照方針 |
|---|---:|---|
| お米 | 茶碗1杯＝生米65g | 農林水産省 |
| 米5kg価格 | 3,373円 | 2026年7月24日公表の全国スーパー平均 |
| 電気料金 | 31円/kWh | 資源エネルギー庁の省エネ試算単価 |
| プール上下水道 | 330円/m³ | 東京都23区の従量料金を丸めた参考値。利用者が変更可能 |
| 防災用水 | 3L/人/日 | 内閣府・農林水産省 |
| 防災食 | 3食/人/日 | 最低3日、推奨7日を選択可能 |
| 携帯トイレ | 5回/人/日 | 東京都の備蓄目安 |

自治体、契約、製品、年齢、生活状況で実値が変わる項目は、利用者が初期値を変更できる設計です。

## 独自ドメインへ変更する場合

次のコマンドで、HTML・robots.txt・sitemap.xml内の公開元URLをまとめて変更できます。

```bash
python3 scripts/update_origin.py https://example.com
npm run check
```

AdSense承認後は広告プレースホルダーを本番広告コードへ置換し、Publisher ID確定後に`ads.txt`を追加してください。

## 問い合わせ

不具合や根拠資料の修正依頼は、GitHub Issuesで受け付けます。

- https://github.com/TI-06/kurashi-calc/issues
