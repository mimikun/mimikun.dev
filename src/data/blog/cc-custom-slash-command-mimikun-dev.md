---
pubDatetime: 2025-12-30T13:51:50.382Z
modDatetime: 2025-12-30T13:51:50.382Z
title: おい！Claude Codeのプロジェクト用カスタムスラッシュコマンドを設定した！
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

この記事ではプロジェクトコマンドの方を設定する。

## プロジェクトコマンド

今(2026年1月8日(木) 21時57分57秒) は以下のコマンドが定義されている。

