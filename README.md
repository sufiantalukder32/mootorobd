# Mootorobd

Browser demo of an SME business marketplace for Bangladesh. Buyers browse shops, unlock sample financials after login, and negotiate a price. There is no backend. Listings, buyers, and deals live in the source code and in `localStorage`.

The npm package is marked `private`, so this repository is meant to be cloned and run, not published to the npm registry.

## Technology

| Area | Choice |
| --- | --- |
| UI | React 18.3 |
| Routing | React Router DOM 6.28 |
| Styling | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| Forms | React Hook Form 7.54 |
| Motion | Framer Motion 11 (negotiation steps) |
| HTTP client | Axios 1.7 (installed for a future API; this demo does not call one) |
| Build | Create React App, `react-scripts` 5.0.1 |
| Tests | Jest and jsdom, included with Create React App |
| Auth | Mock login saved in `localStorage` |
| Currency | Bangladeshi taka (৳), shown in lakhs where the screen is a price conversation |

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 18 or newer, with npm
- Verified locally with Node.js 24.12.0 and npm 11.6.4

`npm start`, `npm test`, and `npm run build` go through `scripts/run.js`. That wrapper adds `--openssl-legacy-provider` so the Create React App compiler still runs on current Node versions. It also sets `BROWSER=none` unless you set `BROWSER` yourself, and it runs tests once instead of leaving Jest in watch mode.

## Installation

```bash
git clone https://github.com/YOUR_USER/mootorobd-demo.git
cd mootorobd-demo
npm ci
```

`npm ci` installs the exact versions in `package-lock.json`. Use `npm install` only when you intend to change dependencies.

Copy `.env.example` to `.env` only if you later point the app at an API. The demo ignores `REACT_APP_API_URL`. Do not commit `.env`.

## Local development

```bash
npm start
```

Open http://localhost:3000. The dev server does not launch a browser on its own. Stop it with Ctrl+C.

`npm start` runs `node scripts/run.js start`, which starts `react-scripts start`.

### Demo buyers

Password for every account is `demo123`.

| Name | Email | Sector |
| --- | --- | --- |
| Arjun Patel | arjun@example.com | Agriculture |
| Fatima Khan | fatima@example.com | Retail |
| Hassan Ahmed | hassan@example.com | Food & Beverage |
| Nida Begum | nida@example.com | Services |
| Karim Islam | karim@example.com | Electronics |

Walkthrough: open Rahim's Rice Mill as a guest, log in as Arjun, express interest, then step the negotiation from ৳5.5 লাখ / ৳4.8 লাখ to an agreed ৳5.2 লাখ. Seller screens are at `/seller-signup` and `/seller/dashboard`.

Fair value on a listing is the average of `annual revenue × 0.6` and `annual profit × 3`. The negotiation screen uses the deal's own suggested price so the rice-mill story stays at ৳5.2 লাখ.

## Tests

```bash
npm test
```

That runs `node scripts/run.js test`. The wrapper adds `--watchAll=false` and sets `CI=true` when `CI` is unset, so Jest runs the suite once and exits. This command does not start the interactive Jest watcher.

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci`, then `npm test`, then `npm run build`, on every push and pull request, using Node.js 20.

| Test file | What it checks |
| --- | --- |
| `src/utils/helpers.test.js` | Taka grouping, lakh and hazar formatting, dates, initials |
| `src/utils/matching-algorithm.test.js` | Arjun + Rahim scores 85; a budget miss drops points |
| `src/utils/valuation-algorithm.test.js` | 0.6× revenue and 3× profit, fair vs overpriced |
| `src/utils/negotiation-algorithm.test.js` | Weighted suggestion and the 5% agreement rule |
| `src/utils/auth.test.js` | Demo login, bad password, signup, logout |
| `src/pages/LandingPage.test.js` | Eight listings render; Agriculture filter leaves one |

These 15 tests cover the pricing helpers, match and valuation math, mock auth, and the landing page. They do not cover login and signup screens, route guards, the negotiation page, or the seller dashboard. Useful next tests:

- Login rejects `demo123` typos and stores a session after a valid demo login.
- `/buyer/dashboard`, `/match/:buyerId/:sellerId`, and `/negotiate/:dealId` redirect guests to login.
- The rice-mill negotiation reaches the agreed ৳5.2 লাখ state.
- Seller signup blocks an incomplete form and accepts a complete one.

## Production build

```bash
npm run build
```

`npm run build` runs `node scripts/run.js build`, which runs `react-scripts build`. The output folder is `build/`. It is generated and is listed in `.gitignore`.

On GitHub Actions, `CI=true` is set by the runner, so Create React App treats warnings as errors during that build.

## Scripts

| Script | Command | What it does |
| --- | --- | --- |
| `start` | `npm start` | Development server at http://localhost:3000 |
| `test` | `npm test` | Jest once, then exit |
| `build` | `npm run build` | Production bundle in `build/` |
| `eject` | `npm run eject` | Copies Create React App config into the project. One way, and not needed to run this demo |

There is no lint script, typecheck script, or separate end-to-end script.

## Project layout

```text
public/          index.html and Netlify _redirects
scripts/run.js   start, test, and build wrapper
src/components/  shared UI
src/data/        sample buyers, sellers, and matches
src/pages/       routes
src/utils/       auth, formatting, and pricing rules
```

Main routes: `/`, `/seller/:id`, `/login`, `/signup`, `/seller-signup`, `/seller/dashboard`, `/buyer/dashboard`, `/match/:buyerId/:sellerId`, `/negotiate/:dealId`.

## Deployment

The app uses `BrowserRouter`, so the host must serve `index.html` for unknown paths such as `/seller/1`.

### Vercel

1. Import the GitHub repository at [vercel.com/new](https://vercel.com/new).
2. Framework preset: Create React App. Build command: `npm run build`. Output directory: `build`.
3. Deploy. `vercel.json` rewrites every path to `index.html`.

### Netlify

1. Import the repository at [app.netlify.com](https://app.netlify.com).
2. Build command: `npm run build`. Publish directory: `build`.
3. Deploy. `public/_redirects` is copied into the build and sends every route to `index.html`.

### GitHub Pages

GitHub Pages does not apply the Netlify or Vercel rewrite. Vercel or Netlify keep clean URLs without extra files. If you still publish on Pages:

1. In `package.json`, set `"homepage"` to `https://YOUR_USER.github.io/mootorobd-demo`.
2. After `npm run build`, copy `build/index.html` to `build/404.html` so a refresh on a deep link loads the app.
3. Push the `build` folder to the `gh-pages` branch, or use the `gh-pages` npm package.

## Publish the repository

This folder is not a Git repository yet, and nothing here uploads it for you. After you create an empty repository on GitHub:

```bash
git init
git add .
git commit -m "Add Mootorobd SME marketplace demo"
git branch -M main
git remote add origin https://github.com/YOUR_USER/mootorobd-demo.git
git push -u origin main
```

`.gitignore` excludes `node_modules/`, `build/`, logs, `.env`, and common secret files. `.env.example` stays in the repository.
