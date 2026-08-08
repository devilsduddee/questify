-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT 'Hero',
    role TEXT CHECK (role IN ('warrior', 'mage', 'ranger', 'rogue')),
    global_achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile." 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Adventures Table
CREATE TABLE IF NOT EXISTS public.adventures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_name TEXT NOT NULL,
    world_name TEXT NOT NULL,
    world_subtitle TEXT,
    world_description TEXT,
    world_element TEXT,
    difficulty TEXT,
    opening_narration TEXT,
    theme JSONB,
    world_icon TEXT,
    estimated_play_time TEXT,
    completion_reward TEXT,
    has_seen_intro BOOLEAN NOT NULL DEFAULT FALSE,
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    max_xp INTEGER NOT NULL DEFAULT 100,
    gold INTEGER NOT NULL DEFAULT 0,
    achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    active_node_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.adventures ENABLE ROW LEVEL SECURITY;

-- Adventures Policies
CREATE POLICY "Users can view their own adventures." 
ON public.adventures FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own adventures." 
ON public.adventures FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own adventures." 
ON public.adventures FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own adventures." 
ON public.adventures FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_adventures_user_id ON public.adventures(user_id);
CREATE INDEX IF NOT EXISTS idx_adventures_last_played_at ON public.adventures(last_played_at DESC);

-- Trigger for updated_at (Profiles)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Trigger for updated_at (Adventures)
CREATE TRIGGER update_adventures_modtime
BEFORE UPDATE ON public.adventures
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'display_name', 'Hero'),
    NULLIF(new.raw_user_meta_data->>'role', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
