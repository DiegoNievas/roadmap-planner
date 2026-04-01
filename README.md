# Roadmap Planner (Phase 2)

An enterprise-grade, internal roadmap and strategy tool for **Atturra Managed Services (AMS)**. Built with React, TypeScript, Vite, and Supabase — designed for persistent, secure collaboration across portfolios and products.

![Views](https://img.shields.io/badge/Views-Home%20•%20Dashboard%20•%20Timeline%20•%20Feature%20Requests-6366f1)
![Stack](https://img.shields.io/badge/Stack-React%20•%20Supabase%20•%20TypeScript%20•%20Vite%20•%20Tailwind-06b6d4)
![Auth](https://img.shields.io/badge/Auth-Supabase%20Managed-22c55e)

---

## What it does

Roadmap Planner provides a single source of truth for AMS roadmap intent across **Connect, Cloud, Security, and AI** portfolios. It enables strategic visibility, prioritization, and a structured intake process for new capabilities and service improvements.

### Key Features (Phase 2)

- **Internal Home / Landing Page** — AMS-specific value positioning with automatic dashboard health metrics and executive roadmap snapshots.
- **Feature Request Intake System** — A dedicated "Request a Feature" flow for internal stakeholders to suggest enhancements, service improvements, and new capabilities.
- **Requests Management Dashboard** — A searchable, filterable triage view to manage incoming suggestions through their lifecycle (New → Review → Backlog → Accepted).
- **Executive-Friendly Snapshots** — High-level summaries of items in progress, recently delivered, and upcoming milestones on the Home page.
- **Multi-user Persistency** — Full Supabase integration replacing local storage with a permanent, relational database.
- **Secure Authentication** — Protected by Supabase Auth with a professional, dark-themed login interface.

---

## Project Structure

```
roadmap-planner/
├── supabase-schema.sql            # Initial core schema
├── supabase-feature-requests.sql  # Phase 2 extension schema
├── src/
│   ├── components/                # UI components (Sidebar, Header, Modal)
│   ├── context/
│   │   ├── AuthContext.tsx        # Session & user management
│   │   └── RoadmapContext.tsx     # Global data & view state
│   ├── services/
│   │   └── storage.ts             # Supabase CRUD service layer
│   ├── views/                     # Page-level views
│   │   ├── HomeView.tsx           # AMS Landing & Metrics
│   │   ├── RequestFeatureView.tsx # Feature Intake Form
│   │   ├── FeatureRequestsView.tsx# Management Dashboard
│   │   ├── Dashboard.tsx          # Resource statistics
│   │   ├── TimelineView.tsx       # Gantt-style timeline
│   │   └── ...                    # Other roadmap views
│   ├── App.tsx                    # Main router & layout
│   └── main.tsx                   # Entry point with AuthProvider
```

---

## Setup & Migration

### 1. Database Configuration
Run the following scripts in your Supabase SQL Editor:
1. `supabase-schema.sql`: Core portfolios, products, and roadmap items.
2. `supabase-feature-requests.sql`: Feature requests table and RLS policies.

### 2. Environment Variables
Create a `.env.local` file with your project credentials:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. CI/CD Deployment
GitHub Actions handles deployment via `.github/workflows/deploy.yml`. Ensure you have added `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as **GitHub Repository Secrets**.

---

## Roadmap Workflow

1. **Intake**: Stakeholders submit requests via **"Request a Feature"**.
2. **Review**: Product owners triage requests in **"Feature Requests"**, updating status to "Accepted" or "Backlog".
3. **Planning**: Accepted requests are manually added to the **"Full Roadmap"** by creating a new `RoadmapItem`.
4. **Visibility**: Leadership monitors progress via the **"Home"** snapshot and **"Executive Dashboard"**.

---

## Tech Stack

- **React 19** & **TypeScript**
- **Supabase** (Postgres, Auth, RLS)
- **Vite 6** & **Tailwind CSS 4**
- **Lucide React** (Icons)
- **date-fns** (Scheduling logic)

---

## License

MIT - Atturra Managed Services Internal
