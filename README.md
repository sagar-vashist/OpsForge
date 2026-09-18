# OpsForge

OpsForge is a modern internal software and project operations platform built for enterprise management of projects, teams, tasks, issues, and deadlines. 

## Features
- **Authentication**: Secure login and registration powered by Supabase Auth.
- **Role-Based Access Control (RBAC)**: Admin, Project Manager, Developer, and Employee roles.
- **Project Management**: Track projects with statuses, priorities, and assigned teams.
- **Task & Kanban Board**: Drag-and-drop Kanban interface for task management.
- **Issue Tracking**: Jira-style issue reporting and resolution.
- **Analytics**: Visualize task completion and project metrics with Recharts.

## Tech Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Components**: shadcn/ui, Lucide Icons, Recharts
- **Backend/Database**: PostgreSQL via Supabase (Row Level Security enabled)
- **Forms & Validation**: React Hook Form, Zod

## Local Setup

1. **Clone the repository** (if applicable) or navigate to the directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and add your Supabase credentials.
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Setup Database**:
   - Create a project on [Supabase](https://supabase.com).
   - Go to the SQL Editor and run the script found in `supabase/migrations/0000_initial_schema.sql`.
   - To add demo data, optionally run `supabase/migrations/0001_seed_data.sql`.
5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

This Next.js application is ready to be deployed on Vercel.
1. Push the code to a GitHub repository.
2. Import the project in Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel Environment Variables.
4. Deploy!

## Screenshots / Structure
The application follows a scalable standard structure:
- `app/`: Next.js App Router pages and layouts.
- `components/ui/`: shadcn/ui reusable components.
- `components/layout/`: Sidebar and Header.
- `components/dashboard/`, `components/kanban/`: Feature specific components.
- `lib/`: Utilities and Supabase SSR clients.
