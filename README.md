# mimikun.dev

## TODO

- [ ] Read the docs
	- Configuration - [markdown](src/data/blog/how-to-configure-astropaper-theme.md)
	- Add Posts - [markdown](src/data/blog/adding-new-post.md)
	- Customize Color Schemes - [markdown](src/data/blog/customizing-astropaper-theme-color-schemes.md)
	- Predefined Color Schemes - [markdown](src/data/blog/predefined-color-schemes.md)

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
