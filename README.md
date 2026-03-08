<p align="center">
  <img src="./public/logo.png" alt="Habit Tracker Logo" width="84" />
</p>

<h1 align="center">Habit Tracker</h1>

<p align="center">
  Build better routines with a fast, modern, and reliable habit tracking experience.
</p>

<p align="center">
  <a href="https://github.com/ahmedbadry-dev/habit-tracker/stargazers"><img src="https://img.shields.io/github/stars/ahmedbadry-dev/habit-tracker?style=for-the-badge" alt="Stars" /></a>
  <a href="https://github.com/ahmedbadry-dev/habit-tracker/network/members"><img src="https://img.shields.io/github/forks/ahmedbadry-dev/habit-tracker?style=for-the-badge" alt="Forks" /></a>
  <a href="https://github.com/ahmedbadry-dev/habit-tracker/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ahmedbadry-dev/habit-tracker?style=for-the-badge" alt="License" /></a>
  <a href="https://github.com/ahmedbadry-dev/habit-tracker/actions"><img src="https://img.shields.io/github/actions/workflow/status/ahmedbadry-dev/habit-tracker/ci.yml?style=for-the-badge&label=CI" alt="CI" /></a>
  <a href="https://habit-tracker.vercel.app"><img src="https://img.shields.io/badge/demo-live-00C853?style=for-the-badge" alt="Live Demo" /></a>
</p>

---

## Overview

Habit Tracker is a full-stack web application for planning habits, tracking daily progress, and staying consistent over time. It combines a responsive Next.js UI with real-time Convex data syncing and efficient client caching through TanStack Query.

Designed with maintainability in mind, this repository follows practical open-source conventions: clean architecture, typed APIs, and contribution-friendly documentation.

## Live Demo

- Production: https://habit-tracker.vercel.app
- Staging (optional): https://habit-tracker-staging.vercel.app

> Update these URLs to match your deployed environments.

## Features

- Daily habit check-ins with streak tracking
- Habit categories, priorities, and custom schedules
- Real-time updates powered by Convex
- Fast optimistic UI and caching with TanStack Query
- Mobile-first responsive design with Tailwind CSS
- Type-safe end-to-end development with TypeScript

## Tech Stack

<p>
  <a href="https://nextjs.org" target="_blank" rel="noreferrer"><img src="https://skillicons.dev/icons?i=nextjs" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org" target="_blank" rel="noreferrer"><img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" /></a>
  <a href="https://www.convex.dev" target="_blank" rel="noreferrer"><img src="https://assets-global.website-files.com/63f6e52346a353ca1752970e/63f6e52346a3535dbf5298f4_convex-logo.svg" alt="Convex" height="48" /></a>
  <a href="https://tanstack.com/query/latest" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/TanStack/query/main/media/repo-header.png" alt="TanStack Query" height="48" /></a>
  <a href="https://tailwindcss.com" target="_blank" rel="noreferrer"><img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind CSS" /></a>
</p>

- Framework: Next.js (App Router)
- Language: TypeScript
- Backend + Database: Convex
- Data Fetching + Cache: TanStack Query
- Styling: Tailwind CSS

## Screenshots

<p align="center">
  <img src="./public/screenshots/dashboard.png" alt="Dashboard Screenshot" width="90%" />
</p>

<p align="center">
  <img src="./public/screenshots/habit-details.png" alt="Habit Details Screenshot" width="44%" />
  <img src="./public/screenshots/mobile-view.png" alt="Mobile Screenshot" width="44%" />
</p>

> Add your real screenshots at `public/screenshots/*` to showcase the UI.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ahmedbadry-dev/habit-tracker.git
cd habit-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in required keys (see [Environment Variables](#environment-variables)).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=
CONVEX_DEPLOY_KEY=
```

Optional (for auth/analytics integrations):

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Folder Structure

```text
habit-tracker/
|-- app/                  # Next.js App Router pages and layouts
|-- components/           # Reusable UI components
|-- convex/               # Convex schema, functions, and server logic
|-- hooks/                # Custom React hooks
|-- lib/                  # Shared utilities and helpers
|-- public/               # Static assets (images, icons, screenshots)
|-- styles/               # Global styles and Tailwind layers
|-- types/                # Global TypeScript types
|-- .env.example          # Environment variable template
`-- README.md
```

## Contributing

Contributions are welcome and appreciated.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to your fork: `git push origin feat/amazing-feature`
5. Open a Pull Request

Before opening a PR:

- Follow existing code style and naming conventions
- Keep PRs focused and easy to review
- Add or update tests when behavior changes
- Update docs for user-facing changes

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Author

**Ahmed Badry**

- GitHub: [@ahmedbadry-dev](https://github.com/ahmedbadry-dev)
- Portfolio: [portfolio-ah2.vercel.app](https://portfolio-ah2.vercel.app)
- LinkedIn: [Ahmed Badry](https://www.linkedin.com/in/ahmedbadry-dev)
