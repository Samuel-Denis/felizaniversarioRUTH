# Feliz Aniversário Ruth 🎂

App interativo (React + Vite + TypeScript) com celebração, quiz e mini-jogo.

## Site no ar (GitHub Pages)

Depois do deploy, o site fica em:

**https://samuel-denis.github.io/felizaniversarioRUTH/**

### Primeira vez no repositório

1. Faz **push** para `main` (o workflow gera a branch **`gh-pages`** com o site).
2. **Settings** → **Pages** → **Build and deployment** → **Source**: **Deploy from a branch**.
3. **Branch**: escolhe **`gh-pages`** e pasta **`/ (root)`** → **Save**.
4. Espera 1–2 minutos e abre o URL acima.

> Se antes tentaste **GitHub Actions** como fonte e deu erro 404 no deploy: esse método usa só a branch **`gh-pages`**, não precisas ativar “GitHub Actions” em Pages.

### Se mudares o nome do repositório no GitHub

Atualiza `REPO_NAME` em `vite.config.ts` para coincidir com o nome do repo (o `base` do Vite tem de ser `/<nome-do-repo>/`).

---

## Desenvolvimento local

```bash
npm install
npm run dev
```

Build de produção (mesmo base que no Pages):

```bash
npm run build
npm run preview
```

---

## React + TypeScript + Vite (template)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
