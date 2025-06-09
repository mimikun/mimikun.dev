# 記事作成スクリプト実装計画

## 概要
`src/data/blog`以下に新しい記事のマークダウンファイルを生成する簡単なスクリプトの実装計画と進捗管理ドキュメント。

## 機能要件
- [x] 新しい記事のMarkdownファイルを`src/data/blog/`に生成
- [x] 必須フィールド（title, author, pubDatetime, description, tags）を含むfrontmatterを自動生成
- [x] インタラクティブまたはコマンドライン引数で記事情報を入力可能
- [x] ファイル名（slug）をユーザーが指定できる

## 実装方針
- ~~Node.jsスクリプトとして実装（TypeScript）~~ → **Deno 2.0スクリプトとして実装**
- コマンドライン引数とインタラクティブモードの両方をサポート
- テンプレートベースでfrontmatterを生成
- **ファイル名（slug）の決定方法：**
  - ユーザーが明示的に指定した場合はそれを使用
  - 指定がない場合はタイトルから自動生成（slugify関数を内部実装）
- **外部ライブラリの使用方針：**
  - ~~CLI実装にはライブラリを使用~~ → Deno標準ライブラリのみ使用
  - その他の機能は標準APIで実装

## 技術選定（最終決定）
- 実行環境: **Deno 2.0**
- CLI実装: `@std/cli/parse-args` （Deno標準ライブラリ）
- インタラクティブ入力: 自前実装（Deno標準APIを使用）
- 日付処理: 標準Date API（`toISOString()`）
- slugify処理: インライン実装
- パス操作: `@std/path`
- ファイルシステム: `@std/fs`

## ファイル構成
```
scripts/
└── create-post.ts    # メインスクリプト
```

## CLI仕様

### コマンドライン引数モード
```bash
pnpm run new-post --title "記事タイトル" --slug "custom-slug" --description "記事の説明"
```

### インタラクティブモード
```bash
pnpm run new-post
```

### オプション一覧
- `--title, -t`: 記事のタイトル（必須）
- `--slug, -s`: ファイル名に使用するslug（任意）
- `--description, -d`: 記事の説明（必須）
- `--tags`: カンマ区切りのタグ（任意、デフォルト: ["others"]）
- `--author, -a`: 著者名（任意、デフォルト: SITE.author）
- `--draft`: 下書きとして作成（任意、デフォルト: false）
- `--featured`: フィーチャー記事として作成（任意、デフォルト: false）

## 実装タスク

### Phase 1: 基本実装
- [x] スクリプトファイル（`scripts/create-post.ts`）の作成
- [x] コマンドライン引数のパース処理実装（@std/cli）
- [x] インタラクティブモードの質問フロー実装（自前実装）
- [x] Markdownファイル生成処理の実装

### Phase 2: 機能拡張
- [x] 既存ファイルとの重複チェック
- [x] frontmatterのバリデーション
- [x] テンプレート本文の追加（Table of contentsなど）

### Phase 3: 統合
- [x] package.jsonにnpm scriptの追加
- [x] エラーハンドリングの実装
- [x] 成功時のメッセージ表示

## frontmatterテンプレート
```yaml
---
pubDatetime: 2025-05-24T15:22:00Z
modDatetime: 2025-05-24T15:22:00Z
title: [ユーザー入力]
featured: [ユーザー入力 or false]
draft: [ユーザー入力 or false]
tags:
  - [ユーザー入力 or "others"]
description:
  [ユーザー入力]
---

## Table of contents

[本文をここに記述]
```

## 進捗状況
- [x] 要件分析完了
- [x] 既存の記事構造とスキーマの確認完了
- [x] 実装方針の最終決定（Deno 2.0採用）
- [x] スクリプトファイルの作成
- [x] package.jsonへのコマンド追加
- [x] 動作確認（記事作成テスト実施）

## 更新履歴
- 2025-06-09: 初版作成
- 2025-06-09: slug指定機能の追加
- 2025-06-09: 外部ライブラリ使用方針の明確化
- 2025-06-09: Deno 2.0での実装完了