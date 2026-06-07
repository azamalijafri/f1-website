# F1 Chronicles

A dark, interactive F1 2026 season dashboard built with React, displaying live driver standings, constructor standings, race calendar, and head-to-head comparisons.

## Features

- **Driver Standings** — Full 2026 championship table with points, wins, podiums per driver
- **Constructor Standings** — Team rankings with horizontal bar chart
- **Race Calendar** — Complete race schedule with round-by-round winners and session times
- **Head-to-Head** — Compare any two drivers (points gap chart) or two teams
- **Driver Profiles** — Tap any driver to see career stats, round-by-round points breakdown
- **Live Data** — Fetches from [Jolpica](https://api.jolpi.ca/ergast/f1) and [OpenF1](https://openf1.org/) APIs with fallback data

## Tech Stack

[React](https://react.dev) · [Vite](https://vitejs.dev) · [Tailwind CSS](https://tailwindcss.com) · [Recharts](https://recharts.org) · [Framer Motion](https://motion.dev) · [Lucide Icons](https://lucide.dev)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```
