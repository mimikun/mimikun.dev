---
pubDatetime: 2025-07-09T06:00:00Z
title: WSLのディスク容量を削減・拡張する方法
featured: false
draft: false
tags:
  - wsl
  - windows
  - disk
  - tips
description:
  新コマンドでより便利に!
---

これまではWSLの仮想ディスクのVHDXファイルのパスを指定して、 `Optimize-VHD` や `diskpart` で処理していたが

WSL v2.5 以降では新コマンドが追加されてより簡単に処理できるようになった。

## これから ( WSL v2.5 以降 )

実行前にディストリビューション名をメモしておく。

念のため、最初にディスクの使用量を確認する。

```powershell
# ディスク使用量確認
wsl --system -d <メモしたディストリビューション名> df -h /mnt/wslg/distro
```

```powershell
# 例として300GBとする
wsl --manage <メモしたディストリビューション名> --resize 300GB
```

ここでは300GBとしたが、若干減ってしまうので、ある程度盛っておくといいかもしれない。

## これまで

以下のコマンドでそれぞれ実現していた。

### 圧縮

`PowerShell` で以下を実行

```powershell
Optimize-VHD -Path c:\path\to\wsl-ubuntu-disk.vhdx -Mode Full
```

### 拡張

管理者権限の `cmd.exe` で以下を実行

```cmd
diskpart
# 以下diskpart内部
Select vdisk file="c:\path\to\wsl-ubuntu-disk"
expand vdisk maximum=356000
exit
```

その後WSLを起動し、WSLのシェルで以下を実行

```shell
sudo mount -t devtmpfs none /dev
mount | grep ext4 # /dev/sd? を探す
sudo resize2fs /dev/sd? 356000M # 直前の手順で見つけたパスを指定
```

## 参考

[How to manage WSL disk space | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/disk-space#expand-vhd-size-using-wsl---manage)

[WSLのディスクサイズ削減方法(2025/07最新)](https://zenn.dev/mimikun/scraps/431ce197587585)

## 所感

256(2^8)GBと512(2^9)GBの間でキリの良い数値がない…

