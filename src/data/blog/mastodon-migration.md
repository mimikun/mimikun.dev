---
pubDatetime: 2025-12-30T13:51:50.382Z
modDatetime: 2025-12-30T13:51:50.382Z
title: おい！Mastodonサーバを移行した！
featured: false
draft: false
tags:
  - mastodon tech
description:
  他にもいろいろ更新した！
---

## Table of contents

8年間運用していたMastodonサーバを移行した。

## 背景

今のサーバは

- 途中で同一サービス内でVPS仮想マシンの移動を伴う変更をしているとはいえ、 8年前の2017年12月に立てたものから大きく構成が変わっていなかった
- 更新するにあたりデータベースのバージョンアップは必須で、データが消えると怖いため、今まで手をつけられずにいた
    - 8年間の投稿データ。データとはいえ **大切な思い出** なので、できれば消去したくない
- 今回、友人に作業立ち会いおよび手伝いをお願いした

という条件が揃ったことにより、移行作業が実施できるようになった。

## 構成

### ハードウェア

VPS業者をConoHaからKAGOYAに変更。

ConoHaはマスコットキャラクターがかわいいのが利点だったけど、どうしても料金が高すぎたので…

性能は CPU 4コア, RAM 4GBのまま変化なし。

ディスク種類はSSD(NVMe)で据置き。

ディスク容量が100GBから600GBに大幅増量！

料金は月3,969円だったところを **月1,760円** と大幅削減！

### オブジェクトストレージ

オブジェクトストレージはAmazon S3から変化なし。

新しくデータベースのバックアップファイル格納用として **Backblaze** を追加した。

メディアファイルもコストがかなり高くつくAmazon S3の使用を止め、Backblazeに移行するという案もあったが

**日本リージョンが用意されていない** という理由により見送った。

これは、日本リージョンがないと、日本では許容される表現のファイルをアップロードしても

まず利用規約違反、そして現地の法律違反で良くてアカウント停止、最悪逮捕される恐れがあるため。

~~その点でいくとAmazon S3の東京リージョンも100%安心とはいえない~~

#### メディア: Amazon S3(AWS)

- リージョン: ap-northeast-1 (東京)
- ストレージタイプ: S3標準

#### DBバックアップ格納: Backblaze

- リージョン: s3.us-west-004.backblazeb2.com (アメリカ西海岸)
- ストレージタイプ: (なし)

### CDN

CDNはCloudflareから変更なし

### ソフトウェア

今回は移行なのでMastodonバージョンはv4.1.5で据置き。

OSのバージョンが Ubuntu 22.04 LTS から Ubuntu 24.04 LTS になった。

### 各種ミドルウェア

今回は移行なのでRubyとNode.jsのバージョンは据置き。

- Ruby: v3.2.2
- Node.js: v16.20.1

PostgreSQL(データベース)とRedisのバージョンを更新した。

- PostgreSQL
    - 移行前: v9.6.24
    - 移行後: v18.0
- Redis
    - 移行前: v7.0.10
    - 移行後: v8.4.0

また、今回はDockerを使う構成からDockerを使わない構成へ移行した。

これは、公式ドキュメントからDockerについての言及が徐々に薄れてきており、またDockerで動かすことによるメリットがあまり得られないと判断したため。

Dockerから **剥がした** ということになる。

念の為書いておくと、旧サーバーでは

- Docker: v27.5.1, build 9f9e405
- Docker Compose: v2.20.3

をそれぞれ使用していた。

## 移行作業

### 移行前の準備

#### 移行作業用プロジェクトリポジトリを作成

自分一人で作業したわけではなく、お手伝いをお願いしたので、情報共有がしやすいようにする必要があった。
そこで、GitHubでプライベートリポジトリを作成し、そこに情報をまとめて見やすいようにした。

`移行準備`, `移行当日作業`, `移行後` といったラベルを用意して進めた。

基本設計、詳細設計を書いてもらった。感謝。
更に移行スクリプトも書いてもらった。深く感謝。

### 移行当日

当日は朝ゆっくり起床した。
9:00くらいに起きて、リポビタンDでファイトイッパツ入れた。
14:00から移行作業を始めた。

不安なので不要と思われる手順でも実行することにして、立ち会い作業のため、ビデオ通話をお願いした。

一応、僕が立ち会ってもらう側です。

#### 作業フロー

ざっくりとした手順では次のとおり。

- スナップショット取得
- データベースバックアップ
- Redisバックアップ
- バックアップファイルを新サーバへ転送
- DNSレコード更新
    - †浸透† まち
- 新サーバで移行スクリプト実行
    - データベースとRedisをバックアップから復元
    - Nginxの設定、証明書設定を実施
- 新サーバでMastodonの起動準備
- Mastodonを起動し、動作チェック

> スナップショット取得とデータベースバックアップでは30分前後とえらい時間がかかったので、友人のコーチングの元、テトリスをプレイして時間を潰した。

> 40LINESのように短時間でクリアを目指すものはまだまだ苦手だとわかった。

#### 移行中に起こった困りごと

##### scpさえ自由にさせてくれない…？

バックアップファイルを新サーバへ転送するとき、ConoHaからSSHポートへの不正アクセス疑惑の警告メールが来た。

大容量ファイルを `scp` するだけで警告が来る仕様なのだろうか…？

##### Mastodonが正常起動しない 😱

ブラウザで `mstdn.mimikun.jp` にアクセスしたところ、Nginxデフォルトの403画面が出ていた。
更にはPostgreSQLデータベースとの接続もうまくいっていないようだった。

###### 1. Nginxの設定ファイルの不備？

正しいパスを設定しましょうというだけの話だった。

あらかじめ旧サーバーからコピーしてきたNginxの設定ファイルを見直した。

serverディレクティブのrootディレクティブが移行前と後で変わっていたので変更した。
該当箇所だけ抜き出す。

移行前(Docker使用)

```bash
server {
  root /home/mastodon/mastodon/public;
}
```

移行後(Docker不使用)

```bash
server {
  root /home/mastodon/live/public;
}
```

###### 2. 証明書ファイルを正しく発行できていなかった

移行スクリプト内ではこのコマンドで証明書を発行していたが、実際に `/etc/letsencrypt/live` を確認したところ期待する証明書ファイルは配置されていなかった。

```bash
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/cloudflare/cloudflare.ini --dns-cloudflare-propagation-seconds 5 --server https://acme-v02.api.letsencrypt.org/directory -d mstdn.mimikun.jp -d files.mimikun.jp
```

どうやら複数指定はできないようで、一つずつ指定しないとできなかった。

```bash
# mstdn.mimikun.jp の証明書を発行
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/cloudflare/cloudflare.ini --dns-cloudflare-propagation-seconds 5 --server https://acme-v02.api.letsencrypt.org/directory -d mstdn.mimikun.jp
# files.mimikun.jp の証明書を発行
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/cloudflare/cloudflare.ini --dns-cloudflare-propagation-seconds 5 --server https://acme-v02.api.letsencrypt.org/directory -d files.mimikun.jp
```

###### 3. データベースに接続できない 😱

`journalctl` でログを見たところデータベースに接続できていないことがわかった。

```txt
Dec 28 18:21:41 v133-18-122-60-vir bundle[136605]: /home/mastodon/.rbenv/versions/3.2.2/lib/ruby/gems/3.2.0/gems/pg-1.5.3/lib/pg/connection.rb:696:in `async_connect_or_reset': connection to
server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "postgres" (PG::ConnectionBad)
```

これは `.env.production` の変更ミスだった。

Dockerで動かす場合と、そうでない場合では設定するべき値が異なる。

適切な値に変更して解決。

###### 4. 依存関係のインストールでエラーが発生した 😱

アセットコンパイル時にエラーが発生した。

```shell
$ yarn install
/usr/lib/node_modules/corepack/dist/lib/corepack.cjs:22240
  return !URL.canParse(descriptor.range);
              ^

TypeError: URL.canParse is not a function
    at isSupportedPackageManagerDescriptor (/usr/lib/node_modules/corepack/dist/lib/corepack.cjs:22240:15)
    at Engine.resolveDescriptor (/usr/lib/node_modules/corepack/dist/lib/corepack.cjs:22988:10)
    at Engine.executePackageManagerRequest (/usr/lib/node_modules/corepack/dist/lib/corepack.cjs:22981:33)
    at async Object.runMain (/usr/lib/node_modules/corepack/dist/lib/corepack.cjs:23684:7)
```

個人的にはcorepackには馴染みがないので使うのをやめた。

また、誤ってaptでNode.jsをインストールしてしまっていた。

Node.js v16を使っている認識だったのに実際はNode.js v24を使っていたことになる。

使い慣れていないバージョンマネージャを使ってもいいことは起きないので、この機会に `rbenv` と `nvm` をやめた。

変わりに [mise](https://github.com/jdx/mise) を使うことにした。

> 🦻 < miseはいいぞ…！
>
> ？ < Nixはもっといいぞ…！

Rubyを再度インストールし直したわけだが、ライブラリのエラーが出た。

`LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2` をつけて、再度ビルドした。成功 👍

###### 5. それでもなぜか起動しない 😱

Mastodonの `mastodon-*.service` ファイル内の値を書き換えてないことが原因だった。

`rbenv`, `nvm` ではなく `mise` を使うようにしたので、 `mise` のパスを指定した。

`LD_PRELOAD` の部分も書き換えした。

#### 動いた！！！

うごいた。よかった。感激。
データも消えなかったし爆発もしなかった。

### 移行後

連合確認のために友人のサーバーのアカウント宛にいくつか下らない投稿をした。

~~ここは貼りたかったけど身内ネタの下らない内容のやり取りなので貼らないことにした~~

2025年12月30日(火)現在、安定して動作しているので

バックアップスクリプトが書け次第、安心のためバックアップを取り、最新のv4.5まで段階的にアップデートする予定。

## おまけ: 下らんので無視してほしい

1. [絵文字ジェネレーター - Slack 向け絵文字を無料で簡単生成](https://emoji-gen.ninja/) で絵文字を生成しダウンロード
2. [mightykho/rascii: Rust ascii image renderer](https://github.com/mightykho/rascii) をインストール
3. ターミナルで `rascii 絵文字.png` と実行

```txt
                                          w****t
 I]]]]]]]]]]]]]]]]]]]]]]]]?              l******l
 m*************************X             t******t
 ***************************    ]Xzzzzzzzm******mzzzzzzzX]
/***************************/  j**************************/             ]0888d/
/***************************/  v**************************v            ~*******f
l***************************i  ****************************            /********
 ***************************   ****************************            t********
 ]XXXXXXXXXX@*******XXXXXXX    ****************************            /*******#
            *******#           ****************************            j********
           v******a            q*****   :tt}~:       *****q             *******
          _*******t            t****m   *****X       m****t             *******
          Z*******             }****]  X******       ]****?             *******
         X*******o               ?]l   *******         ]?               *******
        x********o             IcXXXXXZ******mXXXXXXXXXXXcl             *******
       r*********o}Lv          p**************************p             *******
      ]**********o***0         ****************************             *******
     l****************aI       ****************************             *******
     w*****************m       ****************************             *******
   <d********************l     ****************************             *******
  <m*********************q:    t**************************t             *******
 ?*********W**************m        x*******     m******                 *******
l*********mB*****oh*********;      m******     <******o                 ******#
X*********IB*****o_*********z     ]******X     *******                   *****t
*********? B*****o ?#********    l********Xl  t******m                   &****x
********~  B*****o  ~********    t**********L}*******t                   :ttt~
X*****m    B*****o   ]******U    t*******************
t*****1    B*****o    ?*****]    x******************]
<****x     B*****o     U***a      ]****************m                     l]]]]
 m**]      B*****o      X*#        ]**m************m<                    *****t
 ,~:       B*****o       -:         : :C*************v                  *******
           B*****o                  jX*****************/                *******
           B*****o               tX*********************f               *******
           B*****o              #************************x              ******#
           B*****o              **************tX**********              ?*****X
           B*****o              ************L[  }L********               }tttt:
           B*****o              **********Xl      t******?
           C*****?              Y*******zI         t****X
           t*****                &***X|             ?&**]
           <XB8B|                I]]                 l]l
```

```txt
           rB%%a;                     \++
           %%%%%r                     b%%%Cr1
          }%%%%%b                    %%%%%%%%b}
 !}}}}}}}}C%%%%%%}}}}}}}}}           %%%%%%%%%%Br
 %%%%%%%%%%%%%%%%%%%%%%%%%/         {%%%%%%%%%%%%%r                     }CCCC[
r%%%%%%%%%%%%%%%%%%%%%%%%%%          %%%%%%%%%%%%%%Y                   1%%%%%%)
C%%%%%%%%%%%%%%%%%%%%%%%%%%1         C%%%%%%%%%%%%%%                   L%%%%%%J
B%%%%%%%%%%%%%%%%%%%%%%%%%%B          rC%%%%%%%%%%%%                   %%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%            !rB%%%%%%%%%                   %%%%%%%B
%%%%%%%%%%%%%%%%%%%%%%%%%%%%               !C%%%%%%%                   B%%%%%%%
Y%%%%B    _++;       r%%%%%!                 ;zm%%%Y                   r%%%%%%r
r%%%%C  !C%%%b       !%%%%B           !LC!      !Cr                    r%%%%%%r
 b%%%[  C%%%%%c       0%%%}           %%%%~                            r%%%%%%r
 :}}    %%%%%%B        !}-           B%%%%%          :}}               r%%%%%%r
 }}}}}}C%%%%%%J}}}}}}}}}}}!      }~  %%%%%%          b%%C              r%%%%%%r
z%%%%%%%%%%%%%%%%%%%%%%%%%&+   t%%%z(%%%%%%x        #%%%%r             r%%%%%%r
%%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%r%%%%%%x        %%%%%%             r%%%%%%r
%%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%x        %%%%%%             r%%%%%%r
%%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%x        %%%%%%             r%%%%%%r
%%%%%%%%%%%%%%%%%%%%%%%%%%%%  }%%%%%%%%%%%%x        %%%%%%}            r%%%%%%r
)%%%%%%%%%%%%%%%%%%%%%%%%%a   r%%%%%%%%%%%%x        B%%%%%r            r%%%%%%r
 ![[%%%%%%%C[[[[r%%%%%%C[}    r%%%%%%%%%%%%x        }%%%%%r            r%%%%%%r
   !%%%%%%%!    r%%%%%%r      r%%%%%X%%%%%%x         %%%%%r            }%%%%%%}
   L%%%%%%k     %%%%%%%:      r%%%%%r%%%%%%x      !  %%%%%C             %%%%%%
   %%%%%%%b!   }%%%%%%B       r%%%%%r%%%%%%x    C%%L %%%%%B             }%%%%}
  Z%%%%%%%%%@Y+a%%%%%%        r%%%%%r%%%%%%x   ~%%%%C%%%%%%              1rr}
  %%%%%%%%%%%%%%%%%%%C        W%%%%%r%%%%%%x   %%%%%%X%%%%%
  ~%%%%%%%%%%%%%%%%%%}        %%%%%%r%%%%%%x   %%%%%%b%%%%%
   b%%%%%%%%%%%%%%%%%         %%%%%%r%%%%%%x   %%%%%%B%%%%%               {}
   !C%%%%%%%%%%%%%%%C         %%%%%Cr%%%%%%x   %%%%%%L%%%%%B            [%%%%[
     +;_a%%%%%%%%%%%%Z+       %%%%%rr%%%%%%x   %%%%%%r%%%%%%           ;%%%%%%;
     !rB%%%%%%%%%%%%%%%C      %%%%%rr%%%%%%x   %%%%%%r%%%%%o           r%%%%%%r
  {rC%%%%%%%%%%%%%%%%%%%B!    %%%%%rx%%%%%%C[!r%%%%%% %%%%%            r%%%%%%r
 }%%%%%%%%%%%%%%%%%%%%%%%b    d%%%%!_%%%%%%%%%%%%%%%% L%%%C            r%%%%%%r
 %%%%%%%%%%%%%%b%%%%%%%%%%    !%%%L  %%%%%%%%%%%%%%%%  rCC              %%%%%%
 %%%%%%%%%%%%ar +m%%%%%%%%     ;+;   %%%%%%%%%%%%%%%#                   +ZmmZ+
 %%%%%%%%%%b}     /%%%%%%%           %%%%%%%%%%%%%%%
 b%%%%%%%%r         b%%%%b           B%%%%%%%%%%%%%%
 }%%%%%C}            b%%%}            $%%%%%%%%%%%%r
  }CC}                }}              !CC%%%%%%%CCx
```

```txt
                    +;                                 +m\
                   }BB               CC}!              kBB
        }}}LC}     BBB}             rBBBBBCCL          BBB}            :}rCr!
}BBBBBBBBBBBBk     BBBB             rBBBBBBBB}         BBBr           }BBBBBk{
bBBBBBBBBBBBBB     BBBB             rBBBBBBBBr         BBBr           BBBBBBBB!
BBBBBBBBBBBBBB     BBBB             rBBBBBBBBr        BBBB)          +BBBBBBBBU
BBBBBBBBBBBBBB     BBBB             rBBBBBBBBr        BBBB           BBBBBBBBBB
BBBBBBBBBBBBBB     BBBB             rBBBBBBBBr        BBBB           BBBBBBBBBB
BBBBBBBBBBBBBB     BBBB   {BB       }BBBBBBBBr        BBBB           CBBBBBBBBBC
BBBBBBBBBBBBBk     BBBBl !BBBC       }rCBBBBB{       }BBBB            BBBBBBBBBB
UBBBBBBBBBBBm+     BBBBrxBBBBB            _++        rBBB+            mor;_kBBBB
 }}: LBBBBB!       BBBBBBBBBBB     }B}               rBBB                  rBBBB
     BBBBB{        BBBBBBBBBBB     $BB               rBBB                  rBBBB
    CBBBB}         JBBBBBBBBBB     BBB:              LBBB                  rBBBB
    BBBBC           BBBBBBBBBB     BBBx  }}!         BBB&                  kBBB}
   _BBBB+           BBBBBBBBB!     BBBr mBBB%+       BBBYr)               +BBBB
   rBBBB            BBBBBBBB-     LBBBCBBBBBBB       BBBBBB}              BBBB@
   rBBB[           LBBBBBBq       BBBBbBBBBBBBr      BBBBBBB             rBBBBr
   rBBB           lBBBBBBk        BBBBBBBBBBBBr     $BBBBBBB             kBBBB{
   BBBB           rBBBBBB!        BBBBBBBBBBBBB     BBBBBBBB}            BBBBC
   BBBB           wBBBBo          BBBBBBBBBBBBB     BBBBBBBBr           mBBBo
   BBBQ           BBBBB}          BBBBBBBBBBBBB     BBBBBBBBr           BBBBr
   BBBr           BBBBC           BBBBBBB/CBBBB    }BBBBBBBBr  }        BBBB
   BBBr          }BBBB            BBBBBB}  BBBB*   rBBBBBBBBr BBL       BBBW
   BBBB          BBBBL            %BBBB}   YBBBB   rBBBBBBBBr}BBB       BBBr
   BBBB          BBBBx             BBBx    rBBBB   rBBBB0BBBrrBBB;      rBB_
   BBBB          BBBB?             !Y}     rBBBB   QBBBBxBBBrrBBBr
   BBBB          BBBB                      rBBBB   BBBBCtBBBrrBBB}
   BBBBB         BBBB!                     CBBB$   BBBBr BBB$kBBB
   LBBBB-        BBBBx                     BBBB    BBBBr BBBBBBBB       }}}
   rBBBBo+       BBBBU      \             wBBBB    BBBB; BBBBBBBB      ;BBB1
   rBBBBBBBC     BBBBBC}}}CBB[           LBBBBB   tBBBB  BBBBBBBB      rBBBr
   ?BBBBBBBB     }BBBBBBBBBBBB      WBBCkBBBBBB   rBBBB  BBBBBBB}      rBBBr
    BBBBBBBB[     BBBBBBBBBBBB     !BBBBBBBBBBr   rBBBv  BBBBBBB       rBBBr
    CBBBBBBB$     BBBBBBBBBBBB     rBBBBBBBBBBr   rBBB   CBBBBBB       rBBBr
     oBBBBBBB     0BBBBBBBBBBB     rBBBBBBBBBB\   rBBB    BBBBBm       )BBBr
     rBBBBBBQ     /BBBBBBBBBBB     rBBBBBBBBBL    rBBB    BBBBBr        BBB!
      %BBBBB       BBBBBBBBBBB     xBBBBBBBBB!    xBBr    YBBBB{
      [BBBBB        kBBBBBBBB}      BBBBBBBk~      BBr    -BBBC
        xCC-        !kBBBBkC}       OBBBBBC!       /}      {Lx
```

```txt
       +rr                U%Z
       %%%}              !%%%C                        }}
       %%%r              r%%%%                       }%%!
       %%%r        %%%%%%%%%%%[     b%bCr}}          r%%r
!CCCCCb%%%bCCr    r%%%%%%%% %%r     %%%%%%%b         L%%r           !Cb%%%C
m%%%%%%%%%%%%%r   r%%%%%%%a c%r    r%%%%%%%%         %%%r           %%%%%%%m
%%%%%%%%%%%%%%%   r%%%%%%%r r%r    r%%%%%%%%8        %%%r          B%%%%%%%%!
%%%%%%%%%%%%%%%   r%%%%%%%b r%r    r%%%%%%%%%        %%%r          %%%%%%%%%r
%%%%%%%%%%%%%%%   r%%%%%%%% 8%r    :%%%%%%%%o        %%%r          %%%%%%%%%J
B%%%%%%%%%%%%%@   l%%%%%%%%C%%r     %%%%%%%%        %%%%:          %%%%%%%%%%
1%%%%%%%%%%%%a     ++Y%%%%%%%%      ;nrmma%m        %%%%           n%%%m%%%%%
      i%%%r          r%%%C%%%C                      %%%%            LCl  %%%%
    [bM%%%r          B%%%rb%b     [%C               %%%%                 C%%%
   }%%%%%%r          %%%%! }!     %%%              j%%%C                 C%%%
   b%%%%%%r          %%%%         %%%              r%%%r                 %%%%
   %%%%%%%r          %%%%        }%%%  +YmZ1       r%%%r                r%%%o
  B%%%%%%%r         \%%%%        r%%% C%%%%%C      r%%%%%}             l%%%%r
  %%%%%%%%r       !  %%%%  }C    r%%%}%%%%%%%}     k%%%%%%             r%%%%}
  %%%%b%%%r      }%8 %%%% i%%8   r%%%%%%%%%%%r     %%%%%%%}            %%%%%
  %%%bl%%%r      %%%}%%%%rr%%%   r%%%%%%%%%%%%     %%%%%%%r           !%%%%C
  %%%r %%%&     +%%%r%%%%rr%%%+  r%%%%%%%%%%%%     %%%%%%%r           r%%%%;
  %%%r %%%%     r%%%rb%%%%r%%%r  r%%%%%%%%%%%%    !%%%%%%%r           C%%%[
  %%%b{%%%%     r%%%rr%%%%r%%%r  r%%%%%%rb%%%%[   r%%%%%%%r  }        %%%b
  %%%%b%%%%     r%%%rj%%%%b%%%r  r%%%%%} l%%%%r   r%%%%%%%b r%C       %%%r
  %%%%%%%%%     r%%%} %%%%r%%%q  r%%%%}   %%%%r   r%%%%%%%% X%%       b%%}
  Z%%%%%%%%     o%%%  Z%%%r%%%%  \%%%r    %%%%r   Y%%%Br%%% %%%(      )mZ
   %%%%%%%%     %%%%   %%%C%%%%    }l     %%%%r   %%%% r%%% %%%r
   b%%%%%%%     %%%%   %%%%o%%%           %%%%r   %%%% r%%% %%%x
   }%%%%%%%     %%%%   %%%% %%%l          %%%%r   %%%b r%%%]%%%
    }bb%%%%     %%%]   W%%% %%%r         r%%%%!   %%%r r%%%%%%%       C%J
      r%%%b     %%%    %%%% %%%r        ;a%%%%   m%%%r r%%%%%%%       %%%;
    }C%%%%r     %%% !} %%%% %%%    }CCrCb%%%%%   %%%%} {%%%%%%%       %%%r
   !%%%%%%r     %%b C%%%%%% r%%    b%%%%%%%%%b   %%%%   %%%%%%]       %%%r
   r%%%%%%[     C%r %%%%%%J !%C    %%%%%%%%%%r   %%%%   %%%%%%        %%%r
   r%%%%%%       [  %%%%%%r        %%%%%%%%%%}   %%%%   %%%%%%        %%%{
   r%%%%%_          %%%%%%r        %%%%%%%%%Z    %%%+   Z%%%%Y        Z%8
   r%%%%X           %%%%%%         %%%%%%%%b     %%%    r%%%%}
   }%%%C            %%%%%b         C%%%%%%8!     [%b     B%%b
    8%r             C%%%%}         !CB%%br        !!      }}!
                     C%w}
```

