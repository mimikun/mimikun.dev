# OG画像フォント改善実装記録

## 概要

OG画像の日本語文字が豆腐文字（文字化け）になる問題を解決するため、視認性の高いユニバーサルデザインフォント「BIZ UDGothic」を導入する。

## 問題点

- 現在のフォント：IBM Plex Mono（英語フォントのみ）
- 日本語テキストが含まれるOG画像で文字化けが発生
- 日本語フォントの読み込み設定がない

## 解決策

### 採用フォント

**BIZ UDGothic**を選択
- **開発元**：株式会社モリサワ
- **特徴**：ユニバーサルデザイン原則に基づく設計、読解効率15%向上実証済み
- **ライセンス**：SIL Open Font License (OFL) 1.1（商用利用可・無料）
- **提供元**：Google Fonts
- **バリエーション**：Regular (400), Bold (700)

### 変更対象ファイル

1. **`src/utils/loadGoogleFont.ts`**
   - 日本語文字検出ロジックを追加
   - BIZ UDGothicフォント読み込み設定を追加
   - フォント選択の優先順位設定

2. **`src/utils/og-templates/post.js`**
   - 日本語対応フォントファミリー設定
   - フォントフォールバック設定

3. **`src/utils/og-templates/site.js`**
   - 日本語対応フォントファミリー設定
   - フォントフォールバック設定

## 実装詳細

### フォント読み込みロジック

```typescript
// 日本語文字検出パターン
const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

// フォント設定
const fontConfigs = [
  // 英語用（既存）
  { name: "IBM Plex Mono", font: "IBM+Plex+Mono", weight: 400 },
  { name: "IBM Plex Mono", font: "IBM+Plex+Mono", weight: 700 },
  // 日本語用（新規）
  { name: "BIZ UDGothic", font: "BIZ+UDGothic", weight: 400 },
  { name: "BIZ UDGothic", font: "BIZ+UDGothic", weight: 700 }
];
```

### CSS font-family設定

```css
font-family: 'BIZ UDGothic', 'IBM Plex Mono', sans-serif;
```

## 期待される効果

1. **文字化け解消**：日本語テキストが正常に表示される
2. **視認性向上**：UDフォントによる読みやすさの向上
3. **アクセシビリティ向上**：視覚障害者等への配慮
4. **ブランド統一**：日本語コンテンツにも一貫したフォント適用

## テスト項目

- [ ] 日本語タイトルの記事でOG画像生成
- [ ] 英語タイトルの記事でOG画像生成（既存機能維持）
- [ ] 混在テキスト（日本語+英語）でのOG画像生成
- [ ] フォント読み込みパフォーマンス確認

## 注意事項

- Google Fontsからの動的読み込みのため、ビルド時間が若干増加する可能性
- フォントファイルサイズが増加するため、初回読み込み時間に影響する可能性
- BIZ UDGothicのライセンス（SIL OFL 1.1）により、商用利用・再配布に制限なし

## 参考資料

- [BIZ UDGothic - Google Fonts](https://fonts.google.com/specimen/BIZ+UDGothic)
- [SIL Open Font License 1.1](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL)
- [ユニバーサルデザインフォントについて - モリサワ](https://www.morisawa.co.jp)