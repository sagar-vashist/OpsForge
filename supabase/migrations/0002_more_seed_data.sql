-- 0002_more_seed_data.sql

DO $$
DECLARE
  first_user_id UUID;
  second_user_id UUID;
  team1_id UUID;
BEGIN
  -- Get the first user if exists
  SELECT id INTO first_user_id FROM public.profiles LIMIT 1;
  SELECT id INTO second_user_id FROM public.profiles WHERE id != first_user_id LIMIT 1;

  IF first_user_id IS NOT NULL THEN
    
    -- Create Notifications for the user
    INSERT INTO public.notifications (user_id, title, message, read)
    VALUES 
      (first_user_id, 'New Task Assigned', 'Jane Doe has assigned you to "Design Database Schema"', false),
      (first_user_id, 'Project Update', 'John Smith changed the status of "Alpha System Rewrite" to Active', true),
      (first_user_id, 'Issue Resolved', 'Michael resolved the issue "Build failing on Vercel"', false);

    -- Create Teams
    INSERT INTO public.teams (name, description)
    VALUES ('Engineering Team', 'Core development team')
    RETURNING id INTO team1_id;

    -- Add members to team
    INSERT INTO public.team_members (team_id, user_id)
    VALUES (team1_id, first_user_id);

    IF second_user_id IS NOT NULL THEN
      INSERT INTO public.team_members (team_id, user_id)
      VALUES (team1_id, second_user_id);
    END IF;

  END IF;
END $$;
