---
title: "E2Eテストで使うフォントをFontconfigで固定する"
author: yufushiro
pubDate: "2026-10-05T21:03:00+0900"
---

## 要約

Playwright でレンダリングに使われるフォントを固定するなら、テスト用のコンテナ環境 + Fontconfig の設定で固定化するのが楽です

## はじめに

yufushiro.dev では Astro 6.4 → 7.0 のアップグレードを 2026/6/25 に実施しました[^1]。

[^1]: 記事を書こうと[思っていた](https://m.yufushiro.dev/@yufushiro/116806042751637767)のにすっかり4ヶ月も経ってしまった

Astro のアップグレードを行うために、既存の記事のレイアウト崩れや Markdown パーサーの挙動の変化による表示の崩れが生じていないか確認しておく必要がありました。
今のところ記事数はさほど多くないサイトなので目視で全て確認しても良かったのですが、今回の Astro 以外にも図の生成に使用している Mermaid やその他の Dependabot による依存関係のアップデート時にかかる確認作業の労力を軽減したかったので、今後のためにも Playwright を使ったスクリーンショットによる [Visual regression testing](https://playwright.dev/docs/test-snapshots) を導入することにしました。

スクショによるリグレッションテストは便利な機能である一方で、システム構成の差異による影響を受けやすい難点があります。よくあるのが、ページの描画に使われるフォントが環境によって異なることでローカルではテストに成功するのに CI 環境では失敗するといった現象です。

この記事では、E2E テストでのスクショ生成に使用するフォントの固定化に使われるいくつかの手法の紹介と、最終的に yufushiro.dev で採用した Fontconfig による設定について解説します。

## フォントを固定する方法3種

Playwright 等でのページのレンダリング時に使用するフォントを固定するには次のような方法があります。

### 1. CSS で `font-family` を明示する

テスト対象のページに `font-family: "Noto Sans CJK JP", sans-serif;` のような CSS スタイルを加えることでフォントを固定することができます。

ただし、この方法は指定漏れが発生しやすく、コードブロック内のシンタックスハイライトや Mermaid によるインライン SVG 内で使われるフォントなどで差異が生じる可能性があります。
また、yufushiro.dev においては閲覧者のユーザーエージェント側で設定されたフォントを尊重するために `font-family` を指定しない方針としているため、この方法は採用しませんでした。

### 2. 使用しないフォントをアンインストールする

テスト用のコンテナ環境で実行するのであれば、極端な話 Noto Sans フォントをインストールしてそれ以外のフォントを全て削除してしまえばフォントの差異は発生しなくなるはずです。

しかし、コンテナイメージに Debian を使う場合は依存関係によっては fonts-dejavu-core を削除できない場合があります。
もし他のフォントがシステムにインストールされていたとしても、後述の方法を使用すればより確実にフォントを固定することが可能なため、フォントのアンインストールによる方法は採用しませんでした。

### 3. Fontconfig で generic family を固定する

最終的に採用した方法は、ブラウザ内部で行われるフォント名の名前解決の仕組みを利用した方法です。
Linux では Fontconfig がこの部分を担当しており、`sans-serif`, `serif` および `monospace` を名前解決するための設定を上書きすることでレンダリング時に選択されるフォントを安定化できます。

この方法では Web サイトの CSS に手を加える必要がなく、また Firefox, Chromium, Safari などレンダリングに使用するブラウザに依存せずに使用することができます。

## 実際の設定

以下のような設定を Fontconfig に適用することで、ブラウザが `sans-serif`、`serif`、`monospace` を解決する際に Noto 系の日本語フォントを優先するようになります。

```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <dir>/usr/share/fonts/truetype/noto</dir>
  <dir>/usr/share/fonts/opentype/noto</dir>
  <cachedir prefix="xdg">fontconfig</cachedir>

  <match target="pattern">
    <test qual="any" name="family">
      <string>sans-serif</string>
    </test>
    <edit name="family" mode="prepend" binding="same">
      <string>Noto Sans CJK JP</string>
    </edit>
  </match>

  <match target="pattern">
    <test qual="any" name="family">
      <string>serif</string>
    </test>
    <edit name="family" mode="prepend" binding="same">
      <string>Noto Serif CJK JP</string>
    </edit>
  </match>

  <match target="pattern">
    <test qual="any" name="family">
      <string>monospace</string>
    </test>
    <edit name="family" mode="prepend" binding="same">
      <string>Noto Sans Mono CJK JP</string>
    </edit>
  </match>

  <match target="pattern">
    <edit name="family" mode="append" binding="same">
      <string>Noto Sans CJK JP</string>
    </edit>
  </match>
</fontconfig>
```

実際に使用した設定は [`.devcontainer/playwright-fonts.conf`](https://github.com/yufushiro/yufushiro.dev/blob/f2ffb2be/.devcontainer/playwright-fonts.conf) に置いています。

フォントを指定する際に `mode="prepend"` を指定することで候補の先頭に Noto フォントを置いています。これによって、もしシステムに他のフォントがインストールされていたとしても Noto フォントが優先されるようになり、実行環境による差異が生じにくくなります。

また、最後の設定で `Noto Sans CJK JP` を候補の末尾に追加しているのは、フォールバック時においても Noto フォントが選択されるようにするためのものです。

## Dockerfile との組み合わせ

この設定を有効にするために、テスト用のコンテナイメージには Noto フォントを入れた上で、環境変数 `FONTCONFIG_FILE` を使用して Fontconfig の設定ファイルを読み込ませています。

```dockerfile
FROM mcr.microsoft.com/devcontainers/typescript-node:24-trixie

RUN \
  apt-get update && \
  apt-get install -y --no-install-recommends \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    fonts-noto-core \
    fonts-noto-mono \
  ;

COPY playwright-fonts.conf /etc/fonts/playwright-fonts.conf
ENV FONTCONFIG_FILE=/etc/fonts/playwright-fonts.conf
```

Playwright をコンテナ内で実行するため、ローカルでの実行時と CI 環境での実行時で差異が生じずに動かすことができます。
また、普段使用する環境のフォント設定に手を加えることなく隔離された環境で再現性の高いテスト環境を構築することができました。

## おわり

Linux デスクトップを普段使いしていた頃はよく font-family に `"ＭＳ Ｐゴシック"` や `"メイリオ"` などが指定された Web サイトのフォントを上書きするために Fontconfig の設定を活用していたのですが、今回の Playwright のための設定はその時の知識が活かされた感じでした。

今のところ LLM に聞いてもこの方法は提案してくれないようなので、この記事がいい感じに LLM の学習用にクロールされると良いなと思っています。だが最近のクローラーは本当にお行儀が悪すぎるのでもう少し賢くやれ、いいな？
