# IntelliNote - 次世代の授業メモ整理アプリ


*▲ 時間割ビューとダークモードの表示例*

**IntelliNote**は、大学生の学習効率を最大化するために設計された、高機能な授業メモ整理アプリケーションです。時間割とのシームレスな連携、豊富なメモ機能、そして美しく直感的なUIで、あなたの学生生活を強力にサポートします。

**[<i class="fas fa-rocket"></i> アプリを試してみる！](https://mayu-takeshita.github.io/app---/)**  


---

## 🚀 プロジェクトの背景と目的

このプロジェクトは、大学3年生向けの実習課題としてスタートしました。当初の目的は「4週間でシンプルなメモアプリを完成させる」ことでしたが、開発を進める中で、より学生生活に寄り添った実用的なツールへと進化させることを目指しました。

- **課題:** 紙のノートや複数のアプリに散らばりがちな授業のメモを、一元的に、かつ効率的に管理したい。
- **解決策:** 時間割をハブとして、各授業のメモ、写真をスマートに紐づけるアプリを開発する。
- **目標:** PCでもスマホでも快適に動作し、誰もが「使ってみたい」と思えるような、美しく高機能な学習支援ツールを創造する。

---

## ✨ 機能一覧 (Features)

IntelliNoteは、学生生活をサポートするための豊富な機能を備えています。

### <i class="fas fa-th-large"></i> 時間割機能
- **時間割ビュー:** 自身の履修科目を一覧できる、直感的で美しい時間割。
- **メモ連携:** 時間割の各コマをタップするだけで、該当科目のメモページへ瞬時にジャンプ。

### <i class="fas fa-pen-to-square"></i> 高度なメモ機能
- **Markdown対応:** `**太字**`や`- リスト`など、簡単な記法でメモをリッチに装飾。
- **複数画像添付:** 講義のスライドや黒板の写真を、メモと一緒に複数枚保存可能。
- **科目管理:** 時間割にない科目も「手動入力」や「その他」で柔軟に登録。
- **編集・削除:** 作成したメモはいつでも簡単に編集・削除可能。

### <i class="fas fa-search"></i> 検索・整理機能
- **全文検索:** キーワードを入力するだけで、科目名・メモ本文を横断して瞬時に検索。
- **絞り込み表示:** 「全表示」ボタンで、いつでも全てのメモ一覧に戻ることが可能。
- **並び替え:** 「日付の新しい/古い順」「科目名の昇順/降順」でメモを自由にソート。

### <i class="fas fa-cogs"></i> ユーティリティ機能
- **ダークモード:** 目の疲れを軽減する、美しいダークテーマにワンタッチで切り替え。
- **データ管理:** 全てのメモデータをJSON形式でエクスポート（バックアップ）、インポート（復元）可能。


---

## 🛠️ 使用技術 (Tech Stack)

このアプリケーションは、外部のフレームワークやライブラリに過度に依存せず、Webの基本的な技術を深く理解することを目指して構築されました。

- **フロントエンド:**
  - `HTML5`
  - `CSS3` (Flexbox, Grid Layout, CSS Variables)
  - `JavaScript (ES6+)` (Vanilla JS)
- **データ永続化:**
  - `localStorage`
- **デザイン & UI:**
  - **Pico.css** (ベーススタイル)
  - **Font Awesome** (アイコン)
  - **Google Fonts** (フォント)
  - Glassmorphism & Aurora UI (カスタムCSSによる実装)
- **ライブラリ:**
  - **Marked.js** (Markdownのパース処理)
- **開発・デプロイ環境:**
  - `Git` & `GitHub`
  - `GitHub Pages`

---
## YouTubeリンク
https://youtu.be/s3CgXTD4_pA?si=TWGTPlQ8N8gBMq4J

## 使い方 (Usage)

1.  **[公開ページ](https://mayu-takeshita.github.io/app---/)にアクセスします。**
2.  **時間割の確認:** トップページであなたの時間割を確認できます。
3.  **メモページへ移動:** 右上の「メモ」ボタン、または時間割の科目コマをタップします。
4.  **メモの作成:**
    - 科目を選択（または手動入力）し、メモ本文を入力します。
    - 必要に応じて、「写真を追加」ボタンで画像を添付します。
    - 「登録する」ボタンでメモを保存します。
5.  **データの管理:**
    - 「データ管理」セクションから、メモデータのエクスポートやインポートが可能です。

---

## 開発者情報 (Developer)

- **氏名:** [竹下真結]
- **所属:** 日本大学 理工学部　3年　5806
- **GitHub:** [@Mayu-Takeshita](https://github.com/Mayu-Takeshita/app---)

このプロジェクトは、AIアシスタントとの対話を通じて、要件定義、設計、実装、テスト、改善のサイクルを回しながら開発されました。
