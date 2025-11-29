---
pubDatetime: 2025-11-29T06:39:20.000Z
modDatetime: 2025-11-29T06:39:20.000Z
title: Nix入門 - mimikunの場合
featured: false
draft: true
tags:
  - nix
description:
  Nix入門メモ
---

## Nix

Software DesignのNix連載をよむ。

2025年12月号を買ったので第4回からスタートする。

Nixはすでにインストールされている前提とする。

自分の環境は Linuxラップトップ(Arch Linux) と Windowsデスクトップ(WSL2 ArchLinux)である。

## さまざまな環境管理の方法

### プロジェクト環境: [devenv](https://github.com/cachix/devenv) 

本にある通り操作するとエラーが出る。

```
❯ nix-shell -p devenv
error:
       … while calling the 'derivationStrict' builtin
         at <nix/derivation-internal.nix>:9:12:
            8|
            9|   strict = derivationStrict drvAttrs;
             |            ^
           10|

       … while evaluating derivation 'shell'
         whose name attribute is located at /nix/store/z94r665zv91l4lczh1axj08vjv5hlvkl-nixpkgs/nixpkgs/pkgs/stdenv/generic/make-derivation.nix:353:7

       … while evaluating attribute 'buildInputs' of derivation 'shell'
         at /nix/store/z94r665zv91l4lczh1axj08vjv5hlvkl-nixpkgs/nixpkgs/pkgs/stdenv/generic/make-derivation.nix:400:7:
          399|       depsHostHost                = elemAt (elemAt dependencies 1) 0;
          400|       buildInputs                 = elemAt (elemAt dependencies 1) 1;
             |       ^
          401|       depsTargetTarget            = elemAt (elemAt dependencies 2) 0;

       error: undefined variable 'devenv'
       at «string»:1:107:
            1| {...}@args: with import <nixpkgs> args; (pkgs.runCommandCC or pkgs.runCommand) "shell" { buildInputs = [ (devenv) ]; } ""
             |                                                                                                           ^
```

仕方ないので、公式のドキュメントにあるインストール方法をなぞることにした。

```
nix-env --install --attr devenv -f https://github.com/NixOS/nixpkgs/tarball/nixpkgs-unstable
```

この方法でインストールした場合は直接 `devenv` で起動できる。

> 余談: この記事を書いている段階でストレージが残り70GBしかないためそろそろ買い替え、あるいはNixOSでクリーンインストールすべきかもしれない…

docker-composeと似たような感じでDBを起動することもできる。開発環境に便利なのだろうとおもった。

### 個人ツール管理: [nix profile]
