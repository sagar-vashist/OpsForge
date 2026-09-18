# Development Notes

## Architecture Decisions

1. **Next.js App Router**: Chosen for its built-in API routing, server actions, and layout capabilities. It provides an excellent DX for building a SaaS platform.
2. **Supabase SSR**: We use `@supabase/ssr` to securely handle authentication via cookies. This allows us to use `NextMiddleware` to protect routes and server components to fetch data securely.
3. **Server Actions vs API Routes**: For form submissions (login, register, create project), we rely on Next.js Server Actions. This drastically reduces the amount of boilerplate code needed compared to traditional REST APIs, while maintaining type safety.
4. **shadcn/ui & Tailwind CSS**: This combination allows for building a beautiful, fully accessible, and responsive dashboard without being tied to a heavy component library. It provides the source code directly so we can customize it heavily.

## Database & RBAC

1. **Schema Design**: We implemented standard SaaS tables: `profiles`, `projects`, `tasks`, `issues`, etc. Using `UUID`s for IDs ensures security and prevents enumeration attacks.
2. **Row Level Security (RLS)**: The database is protected using Supabase RLS policies. For instance, tasks can only be updated by the assignee, reporter, or an Admin/Project Manager. This is the most secure approach, as the authorization logic lives directly at the database level.
3. **App Roles Enum**: `ADMIN`, `PROJECT_MANAGER`, `DEVELOPER`, `EMPLOYEE`. This provides a scalable way to handle permissions.

## Known Limitations / Future Improvements

- **Real-time Updates**: Supabase real-time subscriptions can be added to the Kanban board and notifications for a truly collaborative experience.
- **Advanced Drag-and-Drop**: The current Kanban board uses HTML5 Drag and Drop. While functional, a library like `@dnd-kit/core` could provide better mobile support and smoother animations.
- **Complex Analytics**: Currently, analytics fetch raw counts. For highly scalable analytics, we might want to implement a materialized view in PostgreSQL.
