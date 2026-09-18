-- 0001_seed_data.sql
-- For demo purposes, we usually create some dummy users in Supabase Auth first, 
-- but since we are inserting directly via SQL, we can insert into auth.users 
-- OR just create dummy data in profiles directly (if we drop the foreign key or assume users exist).
-- Because Supabase requires users to be in auth.users, and inserting into auth.users 
-- requires hashing passwords and specific fields, it's complex to do via SQL cleanly.
-- However, we can create a script that users can run in the SQL editor.

-- Let's mock a few projects and tasks assuming there is at least one admin user (the one who creates the project).
-- In a real setup, the user should sign up first, then run this. 
-- We will use a DO block to assign things to the first user found.

DO $$
DECLARE
  first_user_id UUID;
  second_user_id UUID;
  p1_id UUID;
  p2_id UUID;
  t1_id UUID;
BEGIN
  -- Get the first user if exists
  SELECT id INTO first_user_id FROM public.profiles LIMIT 1;
  SELECT id INTO second_user_id FROM public.profiles WHERE id != first_user_id LIMIT 1;

  IF first_user_id IS NOT NULL THEN
    -- Make first user ADMIN
    UPDATE public.profiles SET role = 'ADMIN' WHERE id = first_user_id;

    -- Create Project 1
    INSERT INTO public.projects (name, project_code, description, status, priority, manager_id, progress)
    VALUES ('Alpha System Rewrite', 'ALPHA-01', 'Rewriting the core legacy alpha system into Next.js', 'ACTIVE', 'HIGH', first_user_id, 35)
    RETURNING id INTO p1_id;

    -- Create Project 2
    INSERT INTO public.projects (name, project_code, description, status, priority, manager_id, progress)
    VALUES ('Beta Marketing Site', 'BETA-02', 'New marketing site for Q3 launch', 'PLANNING', 'MEDIUM', first_user_id, 0)
    RETURNING id INTO p2_id;

    -- Create Tasks for Project 1
    INSERT INTO public.tasks (project_id, title, description, reporter_id, assignee_id, status, priority)
    VALUES 
      (p1_id, 'Setup Next.js Repository', 'Initialize the repo with Tailwind and Shadcn', first_user_id, first_user_id, 'COMPLETED', 'HIGH'),
      (p1_id, 'Design Database Schema', 'Create tables for users, projects, tasks', first_user_id, second_user_id, 'IN_PROGRESS', 'CRITICAL'),
      (p1_id, 'Implement Auth', 'Use Supabase Auth for login', first_user_id, NULL, 'TODO', 'HIGH'),
      (p1_id, 'Create Dashboard UI', 'Build charts and layout', first_user_id, first_user_id, 'TODO', 'MEDIUM');

    -- Create Issues
    INSERT INTO public.issues (project_id, title, description, reporter_id, status, priority)
    VALUES 
      (p1_id, 'Build failing on Vercel', 'Getting an out of memory error during next build', first_user_id, 'OPEN', 'CRITICAL'),
      (p2_id, 'Missing assets', 'We need the new logos from the design team', first_user_id, 'OPEN', 'MEDIUM');

    -- Activity Logs
    INSERT INTO public.activity_logs (action, entity_type, entity_id, user_id, details)
    VALUES 
      ('CREATED', 'PROJECT', p1_id, first_user_id, '{"project_name": "Alpha System Rewrite"}'),
      ('STATUS_CHANGED', 'TASK', p1_id, first_user_id, '{"old": "TODO", "new": "COMPLETED"}');

  END IF;
END $$;
