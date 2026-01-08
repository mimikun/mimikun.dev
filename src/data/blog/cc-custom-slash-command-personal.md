---
pubDatetime: 2025-12-30T13:51:50.382Z
modDatetime: 2025-12-30T13:51:50.382Z
title: おい！Claude Codeの個人用カスタムスラッシュコマンドを設定した！
featured: false
draft: true
tags:
  - tech
description:
  内容は秒で陳腐化するけど仕方ない！毎秒アップデートせよ！
---

## Table of contents

一応2025年5月くらいからClaude Codeは使ってるのだけど、全然コアに使えていなかったので

このたびカスタムスラッシュコマンドを作成することにした。

[公式ドキュメント](https://code.claude.com/docs/en/slash-commands#custom-slash-commands) を見る。

## コマンドの種類

- プロジェクトコマンド
    - `project_root/.claude/commands`
- 個人コマンド
    - `$HOME/.claude/commands`

と2つある。

この記事では個人コマンドの方を設定する。

## 個人コマンド

今(2026年1月8日(木) 21時57分57秒) はなにも入れていない。

なので、いくつか作って入れていく。汎用性のあるものが望ましい。

- 日報作成支援
    - [Claude CodeのSlash Commandsで日報を作成する - じゃあ、おうちで学べる](https://syu-m-5151.hatenablog.com/entry/2025/06/26/220245) を参考にした
- 日本語翻訳
    - 英語読めないので必要
- Neovim Plugin Scaffolding 支援
    - Neovimプラグインの設定をするときに使いたい


