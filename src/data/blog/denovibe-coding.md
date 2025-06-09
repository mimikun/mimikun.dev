---
pubDatetime: 2025-06-09T12:22:20.473Z
modDatetime: 2025-06-09T12:22:20.473Z
title: 記事生成用のDenoスクリプトをVibe Codingした
featured: false
draft: false
tags:
  - others
description:
  Deno2.0で記事作成スクリプトを実装
---

## Table of contents

## はじめに

この記事はAIが書いています。

## 背景

ブログ記事を作成する際、毎回手動でMarkdownファイルを作成し、frontmatterを記述するのは面倒な作業です。そこで、記事作成を自動化するDenoスクリプトを作成しました。

## 実装内容

### 技術選定

当初はNode.js + TypeScriptでの実装を検討しましたが、tsxなどの追加ツールが必要になることから、Deno 2.0を採用しました。

Deno 2.0の利点：
- TypeScriptがネイティブサポート
- 標準ライブラリが充実
- 追加のビルドツール不要

### 使用した技術

- **Deno 2.0**: 実行環境
- **@std/cli**: コマンドライン引数のパース
- **@std/path**: パス操作
- **@std/fs**: ファイルシステム操作

### 実装のポイント

1. **JSR（JavaScript Registry）の活用**
   ```typescript
   import { parseArgs } from "jsr:@std/cli@^1.0.0/parse-args";
   import { join, dirname, fromFileUrl } from "jsr:@std/path@^1.0.0";
   import { exists } from "jsr:@std/fs@^1.0.0";
   ```
   Deno 2.0で推奨されるJSRを使用して標準ライブラリをインポート

2. **シンプルな対話型プロンプト**
   外部ライブラリを使わず、Deno標準APIで実装：
   ```typescript
   async function prompt(message: string, defaultValue?: string): Promise<string> {
     console.log(message);
     if (defaultValue) {
       console.log(`(default: ${defaultValue})`);
     }
     const buf = new Uint8Array(1024);
     const n = await Deno.stdin.read(buf);
     const answer = new TextDecoder().decode(buf.subarray(0, n!)).trim();
     return answer || defaultValue || "";
   }
   ```

3. **スラッグの自動生成**
   記事タイトルから自動的にURLフレンドリーなスラッグを生成：
   ```typescript
   const slugifyStr = (str: string): string => {
     return str
       .toLowerCase()
       .trim()
       .replace(/[^\w\s-]/g, '')
       .replace(/[\s_-]+/g, '-')
       .replace(/^-+|-+$/g, '');
   };
   ```

### 使い方

スクリプトは2つのモードで動作します：

1. **インタラクティブモード**
   ```bash
   pnpm run new-post
   ```

2. **コマンドライン引数モード**
   ```bash
   pnpm run new-post --title "記事タイトル" --description "記事の説明"
   ```

### 生成されるfrontmatter

スクリプトは以下の形式でfrontmatterを生成します：

```yaml
---
pubDatetime: 2025-06-09T12:22:20.473Z
modDatetime: 2025-06-09T12:22:20.473Z
title: 記事タイトル
featured: false
draft: false
tags:
  - others
description:
  記事の説明
---
```

## まとめ

Deno 2.0を使用することで、追加のビルドツールなしにTypeScriptで記事作成スクリプトを実装できました。標準ライブラリのみで必要な機能を実現でき、シンプルで保守しやすいコードになりました。

今後は、このスクリプトを独立したCLIツールとして切り出すことも検討しています。
