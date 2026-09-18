# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Project screenshots

Full-resolution screenshots live in `assets-src/project/` — **outside** `public/`,
so the originals are never deployed. Run:

```bash
npm run optimize:images
```

This writes `<name>-720.webp` and `<name>-1200.webp` into `public/assets/project/`.
The Projects cards and the Gallery strip build their `srcset` from those two widths.

To add a project, drop the screenshot into `assets-src/project/`, run the command
above, then in `src/data/projectsData.js` point `image` at the **base name** (no
width suffix, no extension) and set `imageWidth` / `imageHeight` to the original
pixel dimensions so the browser can reserve the space before the image loads.
