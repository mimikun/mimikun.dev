# mimikun.dev

## TODO

- [ ] Read the docs
    - Configuration - [markdown](src/data/blog/how-to-configure-astropaper-theme.md)
    - Add Posts - [markdown](src/data/blog/adding-new-post.md)
    - Customize Color Schemes - [markdown](src/data/blog/customizing-astropaper-theme-color-schemes.md)
    - Predefined Color Schemes - [markdown](src/data/blog/predefined-color-schemes.md)
- [ ] icon customize
    - [ ] favicon
    - [ ] Mastodon logo
    - [ ] zenn logo

## Structure

```bash
/
├── public/
│   ├── assets/
|   ├── pagefind/ # auto-generated when build
│   └── favicon.svg
│   └── astropaper-og.jpg
│   └── favicon.svg
│   └── toggle-theme.js
├── src/
│   ├── assets/
│   │   └── icons/
│   │   └── images/
│   ├── components/
│   ├── data/
│   │   └── blog/
│   │       └── some-blog-posts.md
│   ├── layouts/
│   └── pages/
│   └── styles/
│   └── utils/
│   └── config.ts
│   └── constants.ts
│   └── content.config.ts
└── astro.config.ts
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.

All blog posts are stored in `src/data/blog` directory.

## Note

DO NOT RUN `pnpm up` !

## Thanks

- My friends
- [tools/blog_evaluation](https://github.com/nwiizo/workspace_2026/tree/9b4592d6d2726f482045b634a16c29ecb70a31b9/tools/blog_evaluation): using a part of AI review process
    - [LICENSE](https://github.com/nwiizo/workspace_2026/blob/9b4592d6d2726f482045b634a16c29ecb70a31b9/LICENSE)

