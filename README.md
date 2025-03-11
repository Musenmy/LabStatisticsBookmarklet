このアプリは日本語にのみ対応しています。<br>
IMPORTANT: This document is written in 2 languages, but the app itself ONLY supports JAPANESE.

HoYoLABブラウザ版向けの投稿統計用ブックマークレットです。<br>
post detail tablizer bookmarklet for hoyolab browser.

- [使い方 How to Use](#使い方-how-to-use)
- [注意 Caution](#注意-caution)
- [開発者向け For Devs](#開発者向け-for-devs)


## 使い方 HOW TO USE
`lab-bml.min.js` をダウンロードし、ブックマークレットとして登録しLABで使用します。<br>
プロフィール画面 (`/accountCenter`) では、ユーザーの全投稿の集計を行います。時間がかかります。通信環境のいいところで行ってください。<br>
投稿画面 (`/article`) では、その投稿のデータのみを取得します。

Download `lab-bml.min.js` and register as bookmarklet, then apply it on LAB.<br>
In profile screen (`/accountCenter`) , this will accumulate all post data and create table for them. <br>
In post screen (`/article`), only one post you are viewing will be retreived.

## 注意 CAUTION
このツール自体はLABの利用規約に反しませんが、複数回のデータ取得を行い大量のリクエストを送信した場合、スパムと判定されホストから制限を課される可能性があります。<br>
そのような使用を想定していないため、429 エラーへの特別なハンドリングは行っていません。<br>
このツールを使用したことに関して発生するいかなる直接的または間接的な存在について、開発者は責任を負いません。

This tool itself does not violent LAB's Terms of Use, but if you retrieve data multiple times and send a large number of requests, it may be judged as spam and you may be restricted by the host.<br>
Since such use is not expected, no special handling will be done for 429 errors.<br>
We are not responsible for any direct or indirect damages arising from the use of this tool.

## 開発者向け FOR DEVS
`lab-bml.js`は`uglify-js`を通す前のコードです。公開する質ではなく、単に作業中のファイルをアップロードしただけですが、プルリクを出すにはこのファイルの方がいいと思います。

`lab-bml.js` is the original source before being minified. It's not a pretty file, I just uploaded the file I'm working on, but this will be better for sending pull requests.
