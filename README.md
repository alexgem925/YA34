# YA34

> Helping Young Adults 34 turn newcomers into connected community.

YA34 is an internal hub app for YA34 connect group leaders. It centralises planning for CGs and after-service lunches by pulling together data from two sources — **Planning Center** (Ministries) and **Genesis** (the YA34 newcomer database) — into a single place where leaders can plan, track, and act.

---

## The Problem It Solves

Leaders currently have to jump between Planning Center and Genesis to get a full picture of a newcomer or plan a CG session. YA34 brings both into one unified view and adds the tools leaders need on top — a shared calendar, CG planning, and a dashboard that surfaces what needs attention.

---

## Main Features

### Dashboard
A leader's home view. Shows:
- New newcomers this week
- Newcomers needing follow-up
- Upcoming events
- Active groups

### Newcomer View
Unified profile pulling data from both Genesis and Planning Center:
- Name, Status, Notes, Inviter, Zone, CG, Mobile, Email
- Planning Center match status (Linked / Needs Review)

### CG Plan
Planning tool for each connect group session:
- Timeline
- Attendees (pulled from Genesis)
- Role breakdown
- Games
- Transport
- Discussion groups

### Calendar
Shared calendar across all leaders and groups. Any leader can create events visible to all.

---

## Data Sources

| Source | What it provides |
|---|---|
| **Planning Center API** | Ministries, People, Groups data |
| **Genesis (MySQL)** | Newcomer records — name, status, notes, inviter, zone, CG, mobile, email |

Genesis is the system that handles: Form → Newcomer Database → Church Attendance (connect group).

YA34's own database stores: leader accounts, calendar events, CG plans, and attendance records.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js + Tailwind CSS + shadcn/ui |
| Backend | NestJS |
| YA34 Database | MySQL |
| Genesis Database | MySQL via Drizzle ORM (read) |
| Planning Center | REST API |
| Auth | TBD |
| Hosting | Vercel (frontend) + Railway or Render (backend) |

The entire stack is TypeScript end to end.

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- MySQL running locally
- Access to the Genesis local database
- Planning Center API credentials

### Genesis Database Config
You'll need access to the Genesis local database. Ask the Genesis dev for the connection details and add them to your local `.env` file (never commit this file).

### Planning Center API
Generate a Personal Access Token from your Planning Center developer account and add it to your local `.env` file.

---

## Open Questions

- [ ] Should CG attendance be recorded in YA34?
- [ ] Does YA34 need to write data back to Planning Center, or is it read-only for now?
- [ ] Auth provider — confirm with Genesis dev
- [ ] Which Genesis database is the active one?

---

## Background

The connect group was formerly called **Wildfire**. The app exists to carry forward that same energy — igniting connection between newcomers and community under the YA34 name.

---

## Team

- App: YA34 Connect Group
- Genesis integration: loop in the Genesis dev early for DB access and schema questions
