# Roadmap Planner

A lightweight, static web application for **product roadmap planning and visualisation**. Built with React, TypeScript, Vite, and Tailwind CSS — designed to be self-hosted on GitHub Pages with no backend required.

![Dashboard](https://img.shields.io/badge/Views-Dashboard%20•%20Timeline%20•%20Kanban%20•%20Table%20•%20Milestones-6366f1)
![Stack](https://img.shields.io/badge/Stack-React%20•%20TypeScript%20•%20Vite%20•%20Tailwind-06b6d4)
![Storage](https://img.shields.io/badge/Storage-localStorage-22c55e)

---

## What it does

Roadmap Planner helps product and technology leaders capture planned work across multiple portfolios and products, then visualise it on interactive timelines, kanban boards, and executive dashboards.

### Key features

- **Portfolio & Product hierarchy** — organise roadmap items under portfolios (e.g. Connect, Cloud, Security) and products
- **Rich item metadata** — type, priority, status, owner, dates, dependencies, strategic theme, CTO lever, effort, confidence, and more
- **Multiple views:**
  - 📊 Executive Dashboard with stats, top priorities, milestones, and dependency risks
  - 📅 Timeline (Gantt-style) by month, quarter, or year
  - 🏊 Swimlanes by product or portfolio
  - 📋 Kanban board by status
  - 📝 Sortable data table with inline actions
  - 🚩 Milestone timeline
- **Filtering & sorting** — filter by portfolio, product, owner, priority, status, type, CTO lever, or strategic theme
- **Dependency tracking** — visual indicators for delayed dependencies that may impact milestones
- **Dark mode** — toggle between light and dark themes
- **JSON import/export** — back up your data or move between browsers
- **Sample seed data** — loads example data on first visit so you can explore immediately

---

## Quick start

### Prerequisites

- Node.js 18+ and npm

### Run locally

```bash
git clone https://github.com/<your-username>/roadmap-planner.git
cd roadmap-planner
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages on every push to `main`.

### Setup steps

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under "Build and deployment", select **GitHub Actions** as the source
4. Push to `main` — the workflow at `.github/workflows/deploy.yml` handles the rest

Your site will be available at `https://<username>.github.io/roadmap-planner/`

---

## Data storage

### v1 — localStorage

All data is persisted in your browser's `localStorage`. This means:

- Data is private to your browser
- Data survives page refreshes and browser restarts
- Data does NOT sync across devices
- Use **Export / Import** to back up or transfer data

### Future — Supabase

The code is structured with an async service layer (`src/services/storage.ts`) that currently wraps localStorage. To migrate to Supabase or any other backend:

1. Replace the function bodies in `storage.ts` with Supabase client calls
2. The rest of the application (context, components, views) requires no changes

---

## Import / Export

### Export

Click the **Download** icon in the header bar. A `.json` file containing all your portfolios, products, and roadmap items will be downloaded.

### Import

Click the **Upload** icon in the header bar, select a `.json` file previouslyexported from Roadmap Planner. Your current data will be replaced.

### Sample data

On first visit, the app loads example seed data showcasing:

- **Connect** portfolio: Connect Secure Access, Managed SD-WAN
- **Cloud** portfolio: Hybrid Cloud IaaS, Backup as a Service
- 10 roadmap items including features, upgrades, milestones, and dependencies

Use the **Reset** button (↺) to restore seed data at any time.

---

## Project structure

```
roadmap-planner/
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── public/favicon.svg             # App favicon
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── FilterBar.tsx          # Global filter controls
│   │   ├── Header.tsx             # Top bar with actions
│   │   ├── ItemFormModal.tsx      # Create/edit roadmap item form
│   │   └── Sidebar.tsx            # Navigation sidebar
│   ├── context/
│   │   └── RoadmapContext.tsx     # Global state management
│   ├── data/
│   │   └── seed.ts                # Example seed data
│   ├── lib/
│   │   └── utils.ts               # Helper functions
│   ├── services/
│   │   └── storage.ts             # Data persistence layer
│   ├── types/
│   │   └── index.ts               # TypeScript data models
│   ├── views/                     # Page-level view components
│   │   ├── Dashboard.tsx
│   │   ├── TimelineView.tsx
│   │   ├── KanbanView.tsx
│   │   ├── TableView.tsx
│   │   ├── SwimlaneProdView.tsx
│   │   ├── SwimlanePortView.tsx
│   │   └── MilestonesView.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── package.json
└── README.md
```

---

## Roadmap fields

Each roadmap item supports these fields:

| Field | Description |
|-------|-------------|
| Title | Name of the initiative |
| Description | Detailed description |
| Product | Parent product |
| Portfolio | Parent portfolio |
| Type | Feature, Enhancement, Upgrade, Dependency, Technical Debt, Compliance, Operational Improvement, New Capability |
| Priority | Critical, High, Medium, Low |
| Status | Idea, Planned, In Progress, Blocked, Delivered, Deferred |
| Owner | Person responsible |
| Start / End Date | Timeline span |
| Milestone Date | Key delivery milestone |
| Dependencies | Links to other roadmap items |
| Strategic Theme | e.g. Zero Trust Transformation, FinOps |
| CTO Lever | Operational Excellence, Innovation, Cost Management, Revenue Acquisition |
| Customer Impact | Description of impact |
| Confidence Level | High, Medium, Low |
| Effort Estimate | XS, S, M, L, XL, XXL |
| Quarter Label | e.g. Q2 FY26 |
| Colour Tag | Visual colour for timeline bars |
| Notes | Additional notes |

---

## Future enhancements

The codebase is designed to support these future additions:

- Authentication and multi-user support
- Supabase backend storage
- CSV and PDF export
- Now / Next / Later view
- Initiative scoring and prioritisation matrices
- Custom roadmap templates per portfolio
- Drag-and-drop timeline editing
- Linking items to business cases or documents

---

## Tech stack

- **React 19** with TypeScript
- **Vite 6** for fast development and builds
- **Tailwind CSS 4** for styling
- **Lucide React** for icons
- **date-fns** for date manipulation

---

## License

MIT
