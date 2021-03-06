﻿# LyricTyper
  [TexAlive App API](https://developer.textalive.jp/)を用いて作成したアプリケーションです。曲に合わせて歌詞を打ち込むような表現を行います。
  
  デモページ https://gunseikpaseri.github.io/textalive_lyrictyper/
  
  
  背景にもいい感じの帯や歌詞が流れます。
  帯の色はランダムで、曲の節目ごとに切り替わります。サビで帯が加速します。
  帯の色は、songleで類似したセグメントと判断されている者同士は同系統の色で表示。角帯はそれぞれ少し色相をずらしています。
  
  背景の歌詞は単語を区切りの良いところまで適当につなぎ合わせたものが出力されています。
  
  文字の揺れやキャレットの点滅の周期はbeatに合わせています。
  
  
## 他の楽曲で試す
- [ブレス・ユア・ブレス by 和田たけあき feat. 初音ミク](https://gunseikpaseri.github.io/textalive_lyrictyper/?ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Da-Nf3QUFkOU)
- [グリーンライツ・セレナーデ by Omoi feat. 初音ミク](https://gunseikpaseri.github.io/textalive_lyrictyper/?ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DXSLhsjepelI)

## 変更可能オプション
### フォント
フォントを変更できます。手書き・装飾フォントにはWebフォントを利用しています。
### 背景色
背景色を変更できます。
### サビでの色
サビにおける帯と文字の色を変更できます。帯はサビの色を基準に色相で決定しています。
また、帯の彩度明度はこの色に依存します。
### 背景文字大
背景の文字の大きさを選べます。大きすぎると他の文字と干渉します。
### 背景の傾き
背景の角度をdeg単位で調整できます
### console表示
コンソール（テキスト出力部）を表示するか選べます。
### カーソル形状
カーソル（キャレット）の形状を選べます。「愛されなくても君がいる」のPVに合わせ_も用意しました。
### 改行記号
改行の記号を「↵｜↓｜←」の3タイプを選べます
### console文字大
コンソール（テキスト出力部）の文字サイズを選べます。
### console文字色
コンソール用の文字色設定できます。
### 乱数Seed
出力に用いている乱数のSeed値を選べます


## srcファイル構成
### index.ts
主なエフェクトを担当します
### ParameterController.ts
パラメータを管理します。一度の入力でtextalive-playerとdat.gui両方作れます
### PlayController.ts
再生ボタンと停止ボタン押下時の挙動を管理します

## 実行方法

[Node.js](https://nodejs.org/) をインストールしている環境で以下のコマンドを実行すると、開発用サーバが起動します。

```sh
npm install
npm run dev
```
[App Debugger](https://developer.textalive.jp/app/run/)で実行するなどのためにhttps通信が必要ならば`devs`を利用してください。自己証明書ではありますがhttpsサーバとして立ち上がります。
```sh
npm run devs
```


## ビルド

以下のコマンドで `docs` 以下にビルド済みファイルが生成されます。 [デモページ](https://gunseikpaseri.github.io/textalive_lyrictyper/) は [GitHub Pages](https://pages.github.com/) で、このリポジトリの `docs` 以下のファイルが提供されます。

```sh
npm run build
```


