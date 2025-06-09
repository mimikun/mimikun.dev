# Vercel Deno TypeScript Error 修正計画

## 問題の概要

Vercelデプロイ時に以下のエラーが発生:
```
scripts/create-post.ts:42:24 - error ts(2304): Cannot find name 'Deno'.
```

## 原因分析

1. `scripts/create-post.ts` はDenoランタイム用のスクリプト（シバン行: `#!/usr/bin/env -S deno run`）
2. VercelはNode.js環境でビルドを実行するため、Deno APIが認識されない
3. TypeScriptコンパイラがDeno固有のAPI（`Deno.args`, `Deno.stdin`, `Deno.exit`など）を解決できない

## 解決策

### 方法1: TypeScript設定でスクリプトディレクトリを除外（推奨・実施済み）

`tsconfig.json`の`exclude`配列に`scripts`ディレクトリを追加:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "public/pagefind", "scripts"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

**メリット:**
- 最小限の変更で済む
- Denoスクリプトの機能はそのまま維持
- ローカル開発では`pnpm run`経由でスクリプトを実行可能

### 方法2: package.jsonスクリプトをNode.js版に置き換え

現在の`package.json`の`create-post`コマンドをNode.js実装に変更する方法もありますが、既存のDenoスクリプトが高機能なため推奨しません。

### 方法3: ビルド時のみスクリプトを除外

Vercelのビルド設定で`scripts`ディレクトリを無視する設定も可能ですが、tsconfig.jsonでの除外が最もシンプルです。

## 実装チェックリスト

- [x] 問題の原因を分析
- [x] 解決策を検討し、最適な方法を選択
- [x] `tsconfig.json`の`exclude`配列に`"scripts"`を追加
- [x] ローカルでビルドテスト実行（`pnpm run build`）
- [x] ビルドが正常に完了することを確認
- [ ] 変更をGitにコミット
- [ ] Vercelに再デプロイ
- [ ] Vercelでのビルドエラーが解消されたことを確認

## 実装結果

- **実施日**: 2025年1月9日
- **変更ファイル**: `/tsconfig.json`
- **変更内容**: `exclude`配列に`"scripts"`を追加
- **ローカルビルド結果**: ✅ 成功（0 errors, 0 warnings, 0 hints）

## 追加の考慮事項

- `scripts/create-post.ts`はDenoランタイム専用のため、プロダクションビルドには含める必要がない
- ローカル開発では引き続き`deno run`で実行可能
- 将来的にNode.js版のスクリプトが必要な場合は、別ファイルとして作成することを推奨
- `create-post`コマンドは`package.json`で定義されているため、開発者は`pnpm create-post`で引き続き利用可能