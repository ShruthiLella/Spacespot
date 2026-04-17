# Spacespot — Local build instructions

Prerequisites (Windows): install Node.js (LTS) from https://nodejs.org/ or via `winget`.

Quick steps (PowerShell):

1. Verify Node/npm are installed:

```powershell
node -v
npm -v
```

2. (If you don't have Node) Install via winget (optional):

```powershell
winget install OpenJS.NodeJS
```

3. From the project root (`D:\Spacespot`), install and build:

```powershell
npm install
npm run build
```

4. Preview the built site locally (optional):

```powershell
npm run preview
```

If you prefer `pnpm` or `yarn`:

- `pnpm` (enable corepack first):

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
pnpm preview
```

- `yarn`:

```powershell
yarn install
yarn build
yarn preview
```

Notes:
- I scaffolded a minimal Vite+React setup and added `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, and `src/main.tsx`.
- Your existing `App.tsx`, `components/`, and `styles/` are used by the scaffold.

Tell me when you've run the commands and paste any errors if you want me to diagnose them.