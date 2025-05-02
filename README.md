# 🌐 Personal Portfolio

A clean, modern, and responsive developer portfolio to showcase my skills, projects, and experience. Built with performance and accessibility in mind, and designed for both personal branding and SEO.

> 🚀 Inspired by [MiraHikari/portfolio](https://github.com/MiraHikari/portfolio) — adapted and extended to match my vision and tech preferences.

---

## 👣 Changes Implemented

- Added more color options to the theme selector
- Added a language selector to choose between English and Spanish
- Change the layout to have a static side (aside left) and scrollable side on large screens. On smaller screens then it only has one column all scrollable
- Implemented a Navigation bar that is sticky to the top in large screens
- Added Camingo Code custom font as monospace
- Small UI tweaks here and there.

## 📸 Live

![Live](https://mandres.pages.dev)

---

## 🛠️ Stack

- [**Astro**](https://astro.build/) - The next-gen web framework.
- [**Typescript**](https://www.typescriptlang.org/) - JavaScript with type syntax.
- [**TailwindCSS**](https://tailwindcss.com/) - Utility-first CSS framework.
- [**Iconify**](https://iconify.design/) - Icon library.
- [**FancyBox**](https://fancyapps.com/fancybox/3/) - Image viewer.
- [**Ninja Keys**](https://github.com/ssleptsov/ninja-keys) - Dropdown menu with keyboard shortcuts made in pure JavaScript.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ^18.x
- npm or pnpm

### 1. Installation

```bash
git clone https://github.com/Mandres07/PersonalPortfolio.git
pnpm install
```

### 2. Add Your Content:

Edit the `content/cv.en.json` file to create your own Portfolio/CV data.
You can also edit its Spanish version at `content/cv.es.json`

### 3. Launch the Development Server:

```bash
# Enjoy the results
pnpm dev
```
1. Open [**http://localhost:4321**](http://localhost:4321/) in your browser to view the result 🚀

### 4. Customisable colours:
Change the data-theme of `cv.json` and choose one of the colour themes defined in theme.css.

---

## 🧞 Commands

|     | Command         | Action                                                                       |
| :-- | :-------------- | :--------------------------------------------------------------------------- |
| ⚙️  | `dev` or `start` | Launches a local development server at `localhost:4321`.                   |
| ⚙️  | `build`         | Checks for errors and creates a production build in `./dist/`. |
| ⚙️  | `preview`       | Local preview at `localhost:4321`                                       |
| 📦  | `deploy:vercel`         | Deploy on Vercel.                           |
| 📦 | `deploy:cloudflare`       | Deploy on Cloudflare, please run `wrangler login` first.                                           |                                |
---

## 📁 Project Structure

```
public/
├── files/
├── fonts/
├── images/
└── sitemap.xml
src/
├── components/
├── content/
├── layouts/
├── pages/
├── globals.css
└── types.d.ts
```
---

## 🛠️ Built With

- 🚀 Astro
- ✨ TailwindCSS
- 🛠️ TypeScript
- 🛠️ JavaScript
- ☁️ Cloudflare Pages

---

## 📝 License

This project is [MIT](./LICENSE) licensed.

CV JSON schema from [**jsonresume.org**](https://jsonresume.org/schema/)

This project is based on software by **MiraHikari**, licensed under the [MIT License](./LICENSE).  
Modifications made by **Mario Andrés Morales © 2025**.

---

## 📫 Contact

Maintained by [@Mandres07](https://github.com/Mandres07)  
For questions, feel free to open an issue or start a discussion.
