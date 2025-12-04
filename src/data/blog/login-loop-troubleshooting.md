# Arch Linux ログインループ問題のトラブルシューティング記録

## 発生した現象

- ロック画面が表示される
- パスワードを入力する
- 黒い画面になる
- **再びロック画面が表示される**（ループ）

## 環境

- OS: Arch Linux
- ディスプレイマネージャー: LightDM (web-greeter)
- ウィンドウマネージャー: i3
- デフォルトシェル: fish
- スクリーンロッカー: betterlockscreen

## 根本原因

### 主要な原因: `.bashrc` の設定エラー

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

### 副次的な問題

1. **AccountsService が未インストール**
   - LightDM がユーザーリストを取得できない
   - エラー: `Error getting user list from org.freedesktop.Accounts`

2. **GNOME Keyring の問題**
   - エラー: `gkr-pam: the password for the login keyring was invalid`
   - 古いキーリングが残っていた

## なぜ fish をデフォルトシェルにしているのに bash が実行されるのか

### セッション起動の流れ

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

**重要:** ログインシェルが fish でも、PAM のセッション処理や環境変数の初期化には bash が使われる

## 解決手順

### 1. TTY2 へのアクセス

```bash
# グラフィカル画面からTTYへ切り替え
Ctrl + Alt + F2

# ログイン
# ユーザー名とパスワード入力
```

### 2. AccountsService のインストール

```bash
sudo pacman -S accountsservice
sudo systemctl start accounts-daemon
sudo systemctl enable accounts-daemon
```

### 3. GNOME Keyring のリセット

```bash
rm -rf ~/.local/share/keyrings/*
```

### 4. エラーログの確認

```bash
# セッション起動時のエラーを確認
cat ~/.xsession-errors

# LightDM のログ
cat /var/log/lightdm/lightdm.log
journalctl -u lightdm -n 50
```

### 5. `.bashrc` のエラー修正

問題のコードを削除、または安全な形に修正:

```bash
# 修正版: ファイルが存在する場合のみ読み込む
GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR="$GHQ_ROOT/github.com/ghostty-org/ghostty/src"

if [ -n "${GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR}" ] && \
   [ -f "${GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR}/shell-integration/bash/ghostty.bash" ]; then
    builtin source "${GHOSTTY_REPO_S_GHOSTTY_RESOURCES_DIR}/shell-integration/bash/ghostty.bash"
fi
```

### 6. LightDM の再起動

```bash
sudo systemctl restart lightdm

# TTY1 に戻る
Ctrl + Alt + F1
```

## デバッグに使用したコマンド

```bash
# プロセス確認
ps aux | grep -i lock
pgrep -a lock

# インストール済みパッケージ確認
pacman -Qs lock
pacman -Qs greeter

# サービス状態確認
systemctl --user list-units | grep -i lock
systemctl status lightdm
systemctl status accounts-daemon

# 設定ファイル確認
cat /etc/lightdm/lightdm.conf | grep greeter-session
cat ~/.dmrc
ls /usr/share/xsessions/

# ログ確認
journalctl -u lightdm -f
cat ~/.xsession-errors
```

## 学んだこと

1. **`.bashrc` のエラーはログイン失敗を引き起こす**
   - fish ユーザーでも `.bashrc` のメンテナンスが必要
   - `source` する前に必ずファイルの存在確認をする

2. **`.xsession-errors` が重要**
   - セッション起動エラーの詳細が記録されている
   - ログイン問題のデバッグで最初に確認すべきファイル

3. **複数の問題が重なると診断が難しい**
   - AccountsService の欠如
   - GNOME Keyring の問題
   - `.bashrc` のエラー
   - これらが同時に発生していた

4. **TTY へのアクセスは必須スキル**
   - `Ctrl + Alt + F2` でTTY2へ
   - `Ctrl + Alt + F1` でグラフィカル画面へ戻る

## 予防策

### 安全な `.bashrc` の書き方

```bash
# ファイルが存在する場合のみ読み込む
[ -f ~/.bash_aliases ] && source ~/.bash_aliases

# エラーを無視 (あまり推奨されないが緊急時用)
source /some/file 2>/dev/null || true

# 条件付きで読み込む
if [ -f /path/to/file ]; then
    source /path/to/file
fi
```

### 定期的な確認

```bash
# .bashrc の構文チェック
bash -n ~/.bashrc

# .xsession-errors の確認
cat ~/.xsession-errors
```

## 参考情報

- LightDM: https://wiki.archlinux.org/title/LightDM
- Display manager: https://wiki.archlinux.org/title/Display_manager
- GNOME Keyring: https://wiki.archlinux.org/title/GNOME/Keyring
- Xsession: https://wiki.archlinux.org/title/Xsession

## まとめ

fishをデフォルトシェルにしていても、PAMのセッション処理でbashが使われるため、`.bashrc`にエラーがあるとログインできなくなる。ログインループ問題が発生したら、TTY2から`.xsession-errors`を確認し、設定ファイルのエラーを修正する。
