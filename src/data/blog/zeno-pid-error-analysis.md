# zeno.zsh PIDエラー解析レポート

## エラー概要

```
zeno: Failed to get server PID
```

このエラーは、zeno.zshのソケットサーバー起動時にPID取得プロセスで失敗することにより発生します。

## 問題の詳細

### 発生箇所
- **ファイル**: `shells/fish/functions/zeno-start-server.fish:47`
- **関数**: `zeno-start-server`
- **プロセス**: サーバー起動時のPID取得

### 根本原因

#### 1. PID取得の実装問題
```fish
# 問題のあるコード (zeno-start-server.fish:27-30)
fish -c "setsid $server_bin > /dev/null 2>&1 & echo \$last_pid > $pid_file" &
```

**問題点**:
- `$last_pid` はFishの特殊変数だが、サブシェル内で正しく展開されない
- PIDファイルが作成されないか、空の内容になる
- 結果として、PID取得に失敗する

#### 2. プロセス起動タイミング
```fish
# PID待機ループ (zeno-start-server.fish:34-43)
while test $pid_wait_count -lt 10  # 1秒のタイムアウト
    if test -f $pid_file
        set -l server_pid (cat $pid_file)
        # PIDファイルが空または無効な場合、変数が設定されない
        break
    end
    sleep 0.1
    set pid_wait_count (math $pid_wait_count + 1)
end
```

#### 3. 環境状況
- **ソケットパス**: `/run/user/1000/zeno-mimikun/zeno-135040.sock`
- **ソケット状態**: 存在しない
- **サーバープロセス**: 起動していない
- **ディレクトリ**: 作成済み（権限正常）

## 解決方法

### 即座の対処法

#### Option 1: 手動サーバー起動
```bash
# サーバーを直接起動
/home/mimikun/.local/share/zeno.zsh/bin/zeno-server
```

#### Option 2: CLIモードに切り替え
```bash
# ソケットモードを無効化
export ZENO_DISABLE_SOCK=1
```

### 根本的な修正

#### Fish Shell 用の修正
`shells/fish/functions/zeno-start-server.fish` の修正案:

```fish
# 現在の問題コード
fish -c "setsid $server_bin > /dev/null 2>&1 & echo \$last_pid > $pid_file" &

# 修正案
if command -q setsid
    setsid $server_bin > /dev/null 2>&1 &
    set -l server_pid $last_pid
    echo $server_pid > $pid_file
else
    $server_bin > /dev/null 2>&1 &
    set -l server_pid $last_pid  
    echo $server_pid > $pid_file
end
```

#### より堅牢な実装案
```fish
# プロセス起動とPID取得を分離
function start_server_with_pid
    set -l server_bin $argv[1]
    set -l pid_file $argv[2]
    
    # 一時的なスクリプトファイルを作成
    set -l temp_script (mktemp)
    echo "#!/bin/sh" > $temp_script
    echo "exec $server_bin &" >> $temp_script
    echo 'echo $! > '$pid_file >> $temp_script
    chmod +x $temp_script
    
    # スクリプトを実行
    $temp_script
    rm -f $temp_script
end
```

## デバッグ手順

### 1. サーバー起動テスト
```bash
# Denoサーバーが正常に起動できるかテスト
deno run --unstable-byonm --no-check \
  --allow-env --allow-read --allow-run --allow-write \
  -- /home/mimikun/.local/share/zeno.zsh/src/server.ts
```

### 2. 権限確認
```bash
# ソケットディレクトリの権限確認
ls -la /run/user/1000/zeno-mimikun/

# 書き込み権限テスト
touch /run/user/1000/zeno-mimikun/test.tmp && rm /run/user/1000/zeno-mimikun/test.tmp
```

### 3. 環境変数確認
```bash
echo "ZENO_ROOT: $ZENO_ROOT"
echo "ZENO_SOCK: $ZENO_SOCK"
echo "ZENO_SOCK_DIR: $ZENO_SOCK_DIR"
```

## 予防措置

### 1. 設定確認
```fish
# zeno設定が正しく読み込まれているか確認
functions zeno-start-server
```

### 2. 依存関係チェック
```bash
# 必要なコマンドが利用可能か確認
command -v deno
command -v setsid
```

### 3. ログ監視
```bash
# デバッグログを有効化
export ZENO_LOG_LEVEL=debug
```

## 技術的背景

### Fish Shell vs Zsh の違い
- **変数スコープ**: Fishは厳密なスコープルールを持つ
- **バックグラウンド処理**: `&` の動作がZshと異なる
- **PID取得**: `$last_pid` の展開タイミングが異なる

### アーキテクチャ上の課題
- **プロセス間通信**: サブシェルでのPID受け渡し
- **非同期処理**: バックグラウンドプロセスの状態管理
- **エラーハンドリング**: タイムアウトと例外処理

## 関連ファイル

- `shells/fish/functions/zeno-start-server.fish` - メイン問題箇所
- `shells/fish/functions/zeno-set-pid.fish` - PID管理
- `shells/fish/functions/zeno-enable-sock.fish` - ソケット初期化
- `src/server.ts` - Denoサーバー本体
- `bin/zeno-server` - サーバー起動スクリプト

## 今後の改善案

1. **統一されたプロセス管理**: Shell非依存の起動メカニズム
2. **堅牢なエラーハンドリング**: より詳細なエラーメッセージ
3. **デバッグ機能強化**: ログレベル別の出力
4. **テストカバレッジ**: Fish shell特有のテストケース追加

---

**生成日時**: 2025-10-18  
**調査対象**: zeno.zsh (Fish shell integration)  
**環境**: Linux, Fish shell, Deno