---
pubDatetime: 2025-10-13T05:53:26.120Z
modDatetime: 2025-10-13T05:53:26.120Z
title: Nagoya.vim第19回レポート
featured: false
draft: true
tags:
  - nagoyavim
  - zeno
  - fish
description:
  Nagoya.vim第19回で行ったArch Linuxログインループ問題のトラブルシューティング記録。.bashrcの設定エラーが原因で発生したログイン画面ループを解決した手順と学んだことをまとめました。
---

## 📝 注記

この記事はAI（Claude）によって書かれています。

## やったこと

### Arch Linux ログインループ問題のトラブルシューティング

勉強会の直前に遭遇したログイン画面ループ問題を解決しました。

#### 発生した現象

- ロック画面でパスワードを入力
- 黒い画面になる
- **再びロック画面が表示される**（無限ループ）

#### 環境

- OS: Arch Linux
- ディスプレイマネージャー: LightDM (web-greeter)
- ウィンドウマネージャー: i3
- デフォルトシェル: fish
- スクリーンロッカー: betterlockscreen

#### 根本原因

`.bashrc` の設定エラーが原因でした：

```bash
# .bashrc の先頭にあった問題のコード
GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR="$GHQ_ROOT/github.com/ghostty-org/ghostty/src"

if [ -n "${GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR}" ]; then
    builtin source "${GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR}/shell-integration/bash/ghostty.bash"
fi
```

**問題点:**

- `$GHQ_ROOT/github.com/ghostty-org/ghostty/src` が存在しない
- `source` コマンドが存在しないファイルを読み込もうとして失敗
- `.bashrc` の実行が途中で止まる
- セッション起動失敗 → ログイン画面に戻る

#### なぜ fish をデフォルトシェルにしているのに bash が実行されるのか

ログインシェルが fish でも、**PAM のセッション処理や環境変数の初期化には bash が使われる**ため、`.bashrc` にエラーがあるとログインできなくなります。

セッション起動の流れ：

```
LightDM 起動
  ↓
PAM によるセッション処理 (bash を使用)
  ↓
環境変数の初期化 (.bashrc が読み込まれる)
  ↓
デスクトップ環境 (i3) 起動
  ↓
ターミナル起動時に fish が起動
```

#### 解決手順

1. **TTY2 へアクセス**（`Ctrl + Alt + F2`）
2. **エラーログを確認**：
   ```bash
   cat ~/.xsession-errors
   ```
3. **`.bashrc` を修正**：
   ```bash
   # 修正版: ファイルが存在する場合のみ読み込む
   GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR="$GHQ_ROOT/github.com/ghostty-org/ghostty/src"

   if [ -n "${GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR}" ] && \
      [ -f "${GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR}/shell-integration/bash/ghostty.bash" ]; then
       builtin source "${GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR}/shell-integration/bash/ghostty.bash"
   fi
   ```
4. **LightDM を再起動**：
   ```bash
   sudo systemctl restart lightdm
   ```

#### 学んだこと

1. **`.bashrc` のエラーはログイン失敗を引き起こす**
   - fish ユーザーでも `.bashrc` のメンテナンスが必要
   - `source` する前に必ずファイルの存在確認をする

2. **`.xsession-errors` が重要**
   - セッション起動エラーの詳細が記録されている
   - ログイン問題のデバッグで最初に確認すべきファイル

3. **TTY へのアクセスは必須スキル**
   - `Ctrl + Alt + F2` でTTY2へ
   - `Ctrl + Alt + F1` でグラフィカル画面へ戻る

詳細なトラブルシューティング記録は [login-loop-troubleshooting.md](./login-loop-troubleshooting.md) を参照してください。

### zeno.zsh (Fish版) のインストールとデバッグ

[zeno.zsh](https://github.com/yuki-yano/zeno.zsh) のexperimental Fish対応版をインストールしましたが、PIDエラーに遭遇したためデバッグを行いました。

#### 発生したエラー

```
zeno: Failed to get server PID
```

#### 問題の原因

**発生箇所**: `shells/fish/functions/zeno-start-server.fish:47`

zenoのソケットサーバー起動時、PID取得プロセスで以下の問題が発生：

```fish
# 問題のあるコード
fish -c "setsid $server_bin > /dev/null 2>&1 & echo \$last_pid > $pid_file" &
```

**根本原因**:
- `$last_pid` はFishの特殊変数だが、サブシェル内で正しく展開されない
- PIDファイルが作成されないか、空の内容になる
- 結果として、サーバープロセスのPID取得に失敗

#### Fish Shell vs Zsh の違い

- **変数スコープ**: Fishは厳密なスコープルールを持つ
- **バックグラウンド処理**: `&` の動作がZshと異なる
- **PID取得**: `$last_pid` の展開タイミングが異なる

zeno.zshは元々Zsh用に設計されており、Fish対応はまだexperimentalな状態のため、このような互換性問題が存在します。

#### 解決方法

最もシンプルで安全な方法：**CLIモードに切り替え**

```fish
# 即座の対処（セッション内のみ有効）
set -gx ZENO_DISABLE_SOCK 1

# 恒久対策（設定を永続化）
echo "set -gx ZENO_DISABLE_SOCK 1" >> ~/.config/fish/config.fish
```

**効果**:
- ソケットモードを無効化し、CLIモードで動作
- 安定性が高く、エラーが発生しない
- パフォーマンスはやや劣るが、実用上問題なし

#### その他の解決策

詳細な解決策（10種類）と技術的分析は以下を参照：
- [zeno-pid-error-analysis.md](./zeno-pid-error-analysis.md) - 技術的な根本原因分析
- [fish-zeno-solutions.md](./fish-zeno-solutions.md) - 10の解決策と推奨実行順序

#### 学んだこと

1. **Experimental機能のリスク**
   - Fish対応はまだexperimentalなため、本番環境では注意が必要
   - CLIモードという安定したフォールバック手段があることが重要

2. **Shell間の互換性問題**
   - Zsh用ツールをFishで使う際は、変数展開やプロセス管理の違いに注意
   - 特にバックグラウンドプロセスのPID取得は要注意

3. **デバッグアプローチ**
   - ソースコードを読んで問題箇所を特定（`zeno-start-server.fish:47`）
   - 環境変数とプロセス状態を確認
   - シンプルな回避策（CLIモード）で即座に解決

## やりたかったけどできなかったこと

### Nix home-managerによる環境管理の初期設定

当初、Nix home-managerを使って開発環境の設定を宣言的に管理する初期設定を行う予定でした。

#### 予定していた作業

- **Nix home-managerのセットアップ**
  - dotfilesの管理を宣言的に行う
  - シェル設定（fish、bash）の管理
  - エディタ設定（Neovim、VSCode）の統合
  - 開発ツールのパッケージ管理

#### できなかった理由

勉強会の直前に発生した以下の問題のトラブルシューティングに時間を取られました：

1. **Arch Linuxログインループ問題** - `.bashrc`のエラーによるセッション起動失敗の調査と修正
2. **zeno.zsh Fish版のPIDエラー** - experimental機能のデバッグと解決策の検討

これらの予期しない問題の解決に集中したため、home-managerの初期設定まで手が回りませんでした。

#### 次回への持ち越し

- Nix home-managerの基本的なセットアップ
- 既存のdotfilesをNix設定に移行するプラン作成
- Fish shellとの統合テスト
