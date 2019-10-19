# さーたはうす

ゲーム屋さんのwebサイトです。

* たくさんのブラウザゲー
* お絵かきログ
* しろことくろこの塔登るやつ
* ピリカちゃんwebコンソール
* こまごまとしたブログ記事
* 制作物まとめ
* 過去の制作ゲーム

## install

railsを走らせればOK

### 前提

* ruby 2.6.3
* rails 5.2.3

### run

```sh
$ git clone https://github.com/jyllsarta/pirika.git
$ cd pirika/
$ bundle install
$ rails db:migrate
$ yarn install
$ bin/webpack-dev-server # for development
$ rails s
```