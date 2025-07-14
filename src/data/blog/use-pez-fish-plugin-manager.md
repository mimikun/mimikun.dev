---
pubDatetime: 2025-07-14T00:00:00Z
title: fishのプラグインマネージャをpezに変えた
featured: false
draft: false
tags:
  - fish
  - shell
  - plugin-manager
  - pez
description:
  fish shellのプラグインマネージャを変えた
---

## Table of contents

今までは [fisher](https://github.com/jorgebucaran/fisher) を使っていましたが, [アップデートスクリプト](https://github.com/mimikun/mimikun.sh/blob/abc4e57916c5e378c9bb377a7b4d78e3a583e230/src/update/various.sh#L200) 内で `fisher update` を実行するのはちょっと大変でした.

bashからfishを `fish -c` で呼び出す形式だったのもあるし. なぜか毎回 `重複が発生している. 削除してから実行してほしい` (意訳) と出てきていました.

fisher自体も最近あまり活発ではないので, この機会に乗り換えしてしまうか

あるいは `Claude Code` で自作するかと考えていました.

まず, 新規ツールがないか… とGitHubで `fish plugin manager` と検索したところ2ページ目に [pez](https://github.com/tetzng/pez) がありました.

シェルスクリプト製ではなく単一バイナリ(GoやRust製)でシェルのプラグイン管理をするものとしては [sheldon](https://github.com/rossmacarthur/sheldon) があります.

でも, sheldonはだいぶ前にfishのサポートを削除しています.

私はまだfishサポートがあり, experimentalステータスだったとき使ったことがあります

ref: https://github.com/rossmacarthur/sheldon/commit/a804ff231e48a9c7e6895871da9ea926e017058d

ほとんどのプラグインは無事に乗り換えできましたが, 唯一 [tide](https://github.com/IlanCosman/tide) だけは正常にインストールできませんでした.

そこでpezでfisherをインストール, 管理し, fisherでtideだけインストール, 管理する運用に落ち着きました.

この件についてはtideの問題かpezの問題かわからないかぎりイシューしようがないので, まずは調査の段階です.

