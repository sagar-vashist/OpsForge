-- 0000_initial_schema.sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES ENUM
CREATE TYPE app_role AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'EMPLOYEE');
CREATE TYPE project_status AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');
CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED');
CREATE TYPE issue_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE priority_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- PROFILES (Maps to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  role app_role DEFAULT 'EMPLOYEE'::app_role NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TEAMS
CREATE TABLE public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.team_members (
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (team_id, user_id)
);

-- PROJECTS
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  project_code TEXT NOT NULL UNIQUE,
  description TEXT,
  status project_status DEFAULT 'PLANNING'::project_status NOT NULL,
  priority priority_level DEFAULT 'MEDIUM'::priority_level NOT NULL,
  start_date DATE,
  deadline DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- PROJECT MEMBERS (for explicit membership beyond teams)
CREATE TABLE public.project_members (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (project_id, user_id)
);

-- TASKS
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  status task_status DEFAULT 'TODO'::task_status NOT NULL,
  priority priority_level DEFAULT 'MEDIUM'::priority_level NOT NULL,
  due_date TIMESTAMPTZ,
  estimated_hours DECIMAL(6,2),
  actual_hours DECIMAL(6,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ISSUES
CREATE TABLE public.issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status issue_status DEFAULT 'OPEN'::issue_status NOT NULL,
  priority priority_level DEFAULT 'MEDIUM'::priority_level NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- COMMENTS
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Ensure it's attached to exactly one entity
  CONSTRAINT comment_target_check CHECK (
    (project_id IS NOT NULL AND task_id IS NULL AND issue_id IS NULL) OR
    (project_id IS NULL AND task_id IS NOT NULL AND issue_id IS NULL) OR
    (project_id IS NULL AND task_id IS NULL AND issue_id IS NOT NULL)
  )
);

-- ACTIVITY LOGS
CREATE TABLE public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- e.g., 'PROJECT', 'TASK', 'ISSUE'
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-----------------------------------------------------------
-- TRIGGERS & FUNCTIONS
-----------------------------------------------------------

-- Updated At triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    COALESCE((new.raw_user_meta_data->>'role')::app_role, 'EMPLOYEE'::app_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-----------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-----------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone can view profiles, only user or admin can update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.is_admin());

-- Projects: Everyone can view, Admins and PMs can insert/update/delete
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Projects insertable by Admin and PM" ON public.projects FOR INSERT WITH CHECK (
  public.is_admin() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'PROJECT_MANAGER')
);
CREATE POLICY "Projects updatable by Admin and PM" ON public.projects FOR UPDATE USING (
  public.is_admin() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'PROJECT_MANAGER')
);
CREATE POLICY "Projects deletable by Admin" ON public.projects FOR DELETE USING (public.is_admin());

-- Tasks: Everyone can view, DEVELOPER/EMPLOYEE can update if assigned, Admin/PM can do anything
CREATE POLICY "Tasks viewable by everyone" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Tasks insertable by Admin, PM, Developer" ON public.tasks FOR INSERT WITH CHECK (
  public.is_admin() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('PROJECT_MANAGER', 'DEVELOPER'))
);
CREATE POLICY "Tasks updatable by Admin, PM, Reporter, or Assignee" ON public.tasks FOR UPDATE USING (
  public.is_admin() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'PROJECT_MANAGER') OR
  auth.uid() = assignee_id OR
  auth.uid() = reporter_id
);
CREATE POLICY "Tasks deletable by Admin and PM" ON public.tasks FOR DELETE USING (
  public.is_admin() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'PROJECT_MANAGER')
);

-- Issues: Similar to tasks
CREATE POLICY "Issues viewable by everyone" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Issues insertable by authenticated users" ON public.issues FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Issues updatable by Admin, PM, Reporter, or Assignee" ON public.issues FOR UPDATE USING (
  public.is_admin() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'PROJECT_MANAGER') OR
  auth.uid() = assignee_id OR
  auth.uid() = reporter_id
);
CREATE POLICY "Issues deletable by Admin and PM" ON public.issues FOR DELETE USING (
  public.is_admin() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'PROJECT_MANAGER')
);

-- Comments: Viewable by all, editable by author or admin
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Comments insertable by authenticated users" ON public.comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Comments updatable by author" ON public.comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Comments deletable by author or admin" ON public.comments FOR DELETE USING (
  auth.uid() = author_id OR public.is_admin()
);

-- Activity Logs: Viewable by all, insertable via triggers/api, no delete/update
CREATE POLICY "Activity logs viewable by everyone" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Activity logs insertable by authenticated users" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications: Only visible to the owner
CREATE POLICY "Notifications viewable by owner" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications insertable by authenticated users" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Notifications updatable by owner" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Notifications deletable by owner" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Others (Teams, Team Members, Project Members)
CREATE POLICY "Teams viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Teams updatable by Admin" ON public.teams FOR ALL USING (public.is_admin());
CREATE POLICY "Team Members viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team Members updatable by Admin or PM" ON public.team_members FOR ALL USING (
  public.is_admin() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'PROJECT_MANAGER')
);
CREATE POLICY "Project Members viewable by everyone" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Project Members updatable by Admin or PM" ON public.project_members FOR ALL USING (
  public.is_admin() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'PROJECT_MANAGER')
);
