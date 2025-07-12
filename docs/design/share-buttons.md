# クリップボードコピーボタン設計書

## 概要

記事シェア機能をソーシャルメディア依存から脱却させ、汎用的なクリップボードコピー機能に変更する。既存のShareLinksコンポーネントは保持し、新しいCopyShareButtonコンポーネントを作成することで、upstream（AstroPaper）への追従性を維持する。

## 背景・目的

### 現状の課題
- ソーシャルメディアプラットフォームが増えるたびに改修が必要
- 現在はX（Twitter）のみ実装済みで他はコメントアウト状態
- プラットフォーム固有のAPI変更に影響される

### 目標
- プラットフォーム非依存のシェア機能
- ユーザーが好きな場所に貼り付け可能
- 保守性の向上
- upstream追従時のコンフリクト最小化

## 要件定義

### 機能要件

1. **コピー内容**
   ```
   記事タイトル - サイト名
   https://example.com/posts/article-slug
   ```

2. **対象ページ**
   - ブログ記事詳細ページ（PostDetails.astro）

3. **ユーザーインタラクション**
   - ボタンクリックでクリップボードにコピー
   - 成功・失敗の視覚的フィードバック

### 非機能要件

1. **ブラウザサポート**
   - Clipboard API対応ブラウザ
   - HTTPS環境必須

2. **アクセシビリティ**
   - スクリーンリーダー対応
   - キーボード操作対応

3. **保守性**
   - 既存コードとの分離
   - upstream追従の容易さ

## アーキテクチャ設計

### コンポーネント構成

```
src/components/
├── ShareLinks.astro          # 既存（保持）
└── CopyShareButton.astro     # 新規作成
```

### データフロー

```
PostDetails.astro
└── CopyShareButton.astro
    ├── props: { title }
    ├── import: SITE.title
    └── client: window.location.href
```

### 置き換え方法

```astro
<!-- PostDetails.astro (119行目) -->
<!-- 既存（コメントアウトして保持） -->
<!-- <ShareLinks /> -->

<!-- 新規実装 -->
<CopyShareButton title={title} />
```

## 実装仕様

### CopyShareButton.astro

```astro
---
import { SITE } from "@/config";

export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="flex flex-col flex-wrap items-center justify-center gap-1 sm:items-start">
  <span class="italic">Share this post:</span>
  <div class="text-center">
    <button
      id="copy-share-text"
      class="scale-90 p-2 hover:rotate-6 sm:p-1 rounded border focus-outline group"
      title="Copy share text to clipboard"
    >
      <!-- クリップボードアイコン -->
      <svg class="inline-block size-6 scale-125 fill-transparent stroke-current stroke-2 opacity-90" viewBox="0 0 24 24">
        <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="sr-only">Copy share text to clipboard</span>
    </button>
  </div>
</div>

<script define:vars={{ title, siteName: SITE.title }}>
  document.getElementById('copy-share-text')?.addEventListener('click', async (event) => {
    const button = event.target as HTMLButtonElement;
    const originalContent = button.innerHTML;
    
    try {
      const url = window.location.href;
      const shareText = `${title} - ${siteName}\n${url}`;
      
      await navigator.clipboard.writeText(shareText);
      
      // 成功フィードバック
      button.innerHTML = `
        <svg class="inline-block size-6 scale-125 fill-green-500 stroke-current stroke-2" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="sr-only">Copied successfully</span>
      `;
      
      setTimeout(() => {
        button.innerHTML = originalContent;
      }, 2000);
      
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      
      // 失敗フィードバック
      button.innerHTML = `
        <svg class="inline-block size-6 scale-125 fill-red-500 stroke-current stroke-2" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="sr-only">Copy failed</span>
      `;
      
      setTimeout(() => {
        button.innerHTML = originalContent;
      }, 2000);
    }
  });
</script>
```

## エラーハンドリング

### 想定されるエラー
1. `navigator.clipboard`未対応ブラウザ
2. HTTP環境での実行
3. ユーザーの権限拒否

### 対応方針
1. **視覚的フィードバック**: アイコン変更で成功・失敗を通知
2. **フォールバック**: 将来的にはテキスト選択UI提供を検討
3. **ログ出力**: デバッグ用にconsole.errorでエラー記録

## ユーザーインターフェース

### デザイン指針
- 既存のShareLinksと同じ位置・レイアウト
- AstroPaperのデザインシステムに準拠
- ホバー効果: `hover:rotate-6`で統一感

### 状態表示
- **通常**: クリップボードアイコン
- **成功**: チェックマークアイコン（2秒間）
- **失敗**: ×マークアイコン（2秒間）

## 実装手順

1. **CopyShareButton.astro作成**
   - コンポーネントファイル作成
   -基本機能実装

2. **PostDetails.astro修正**
   - ShareLinksをコメントアウト
   - CopyShareButtonを追加

3. **動作確認**
   - 開発環境でのテスト
   - 各ブラウザでの動作確認
   - HTTPS環境での確認

4. **スタイル調整**
   - 既存デザインとの統一
   - レスポンシブ対応確認

## テスト方針

### 機能テスト
- [ ] クリップボードコピー機能
- [ ] 成功時のフィードバック表示
- [ ] 失敗時のフィードバック表示
- [ ] コピー内容の形式確認

### ブラウザテスト
- [ ] Chrome（Clipboard API対応）
- [ ] Firefox（Clipboard API対応）
- [ ] Safari（Clipboard API対応）

### 環境テスト
- [ ] HTTPS環境
- [ ] localhost環境
- [ ] プロダクション環境

## 将来の拡張予定

### 設定による切り替え
```typescript
// config.ts
export const SITE = {
  // ...
  shareMode: "clipboard" | "social" as const,
}
```

### 複数フォーマット対応
- プレーンテキスト
- Markdown形式
- HTML形式

## リスク・制約事項

### 技術的制約
- Clipboard APIはHTTPS必須
- ブラウザサポートの制限
- ユーザー権限に依存

### upstream追従リスク
- PostDetails.astroの変更箇所が競合する可能性
- 軽微な修正で対応可能

## 参考実装

既存のコードコピー機能（PostDetails.astro:232-271行）を参考に、一貫したUXを提供する。