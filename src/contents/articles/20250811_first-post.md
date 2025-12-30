---
title: "yufushiro.dev の Web サイトを公開"
author: yufushiro
pubDate: "2025-08-11T03:28:00+0900"
---

`yufushiro.dev` の[登録情報](https://pubapi.registry.google/rdap/domain/yufushiro.dev) (RDAP) によると、どうやらこのドメイン名は <time datetime="2023-02-02T07:51:39.697Z">2023-02-02 16:51:39 (Asia/Tokyo)</time> に取得したらしいです。

同日中に [m.yufushiro.dev](https://m.yufushiro.dev/) で Mastodon サーバーの運用を始めましたが、`yufushiro.dev` (Zone Apex) には A や AAAA RR が設定されることはなく、そのまま 2 年以上が経過してしまいました。

```console
$ dig yufushiro.dev aaaa @alla.ns.cloudflare.com +norec +short
$
```

まあ何か記事を書くと言っても今まで内容的にも Zenn で事足りていましたが、どうしても時折 Self-hosted でやっていくぞ！的な発作を起こしてしまうのでようやく重い腰を上げて https://yufushiro.dev/ で Web サイトを公開することにしました。

最終的に採用したのは [Astro](https://astro.build/) + [Cloudflare Pages](https://www.cloudflare.com/developer-platform/products/pages/) という構成の静的サイトです。
Astro は Vue SFC っぽい感じでコンポーネントを書いていけるし、JavaScript に依存しないページであれば最終的に出力される HTML からも `<script>` 要素が無くなったシンプルなものになる所が良いですね。

そして見ての通りですが、CSS フレームワーク的なものは今のところ導入していません。
Astro 公式のテーマで [Blog](https://astro.build/themes/details/blog/) が用意されていましたが、なんかしっくりこなくて結局 Markdown から変換した HTML をほぼ素の状態で出す感じになりました。この方向性でいくなら [Pico CSS](https://picocss.com/) の [Class-less version](https://picocss.com/docs/classless) とかが軽量な CSS でかつセマンティックな HTML 要素に対してデフォルトでいい感じのスタイルを当ててくれそうですが、その辺は必要になったら考えることにします。
