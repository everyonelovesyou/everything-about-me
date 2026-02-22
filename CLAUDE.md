# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # 開発サーバー起動 (localhost:4321)
npm run build     # 本番ビルド → ./dist/
npm run preview   # ビルド結果のプレビュー
npx astro check   # TypeScript 型チェック
```

## Architecture

Astro 5 製のポートフォリオサイト。

GitHub Pages (`https://everyonelovesyou.github.io/everything-about-me`) にデプロイする予定。

### ページ構成

情報設計としてのページ構成の内容は [`doc/pages.md`](./doc/pages.md) に記載あり。

| ルート | ファイル |
|---|---|
| `/` | `src/pages/index.astro` |
| `/about/` | `src/pages/about.astro` |
| `/works/` | `src/pages/works.astro` |
| `/blog/` | `src/pages/blog/index.astro` |
| `/blog/[id]/` | `src/pages/blog/[id].astro` |
| `/contact/` | `src/pages/contact.astro` |

### レイアウト・共通コンポーネント

- `src/layouts/BaseLayout.astro` — 全ページ共通のレイアウト。Props: `title` (必須), `description` (任意), `pageClass` (任意)。
- `src/components/FloatingNav.astro` — 全ページに表示されるフローティングナビゲーション。
- `src/styles/global.scss` — グローバルスタイル。SCSS で記述する (`sass` を devDependency に追加済み)。

#### 3カラムレイアウト

`BaseLayout.astro` に CSS Grid による3カラムレイアウトを実装済み。

```
.layout
├── .side.side--left   (aside)   ← 768px 以下では非表示
├── .center            (div)     ← <slot /> が入る
├── .side.side--right  (aside)   ← 768px 以下では非表示
└── .floating-nav                ← FloatingNav (画面端に sticky 配置)
```

- `--center-width: 480px` (CSS カスタムプロパティ) で中央カラムの幅を制御。
- 768px 以下はシングルカラム、769px 以上で3カラムに切り替わる。
- `.side--left` / `.side--right` は現在コメントアウト中。

#### ページ固有のスタイル

各ページは `pageClass` prop でクラスを `<body>` に付与し、レイアウト要素を上書きできる。

```astro
<BaseLayout title="About" pageClass="page-about">...</BaseLayout>

<style is:global lang="scss">
  .page-about .side--left { /* ... */ }
</style>
```

### ブログ (Content Collections)

- ブログ記事は Markdown ファイルとして `src/data/blog/` に配置する。
- コレクション定義は `src/content.config.ts` にある。フロントマターのスキーマ:

```yaml
---
title: string        # 必須
description: string  # 必須
pubDate: date        # 必須
updatedDate: date    # 任意
tags: string[]       # 任意
draft: boolean       # 任意 (default: false)
---
```

- `draft: true` のファイルはビルドから除外される。
- 記事の slug は **ファイル名から拡張子を除いた文字列** がそのまま `/blog/[id]/` の `id` になる。

### BASE_URL の扱い

`astro.config.mjs` で `base: '/everything-about-me'` が設定されているため、内部リンクは必ず `import.meta.env.BASE_URL` を使う。

```astro
<a href={`${import.meta.env.BASE_URL}/about/`}>About</a>
```

### デプロイ

現時点ではデプロイを実行しない。
将来的には `main` ブランチへの push で GitHub Actions (`.github/workflows/deploy.yml`) が自動実行され、GitHub Pages にデプロイされる予定。手動トリガー (`workflow_dispatch`) も可。
