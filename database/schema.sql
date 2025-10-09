-- Users Profile Table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons Table
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Quizzes Table
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Questions Table
CREATE TABLE quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  answers JSONB,
  passed BOOLEAN,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PC Lab Simulations Table
CREATE TABLE pc_lab_simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  simulation_type TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Lab Progress Table
CREATE TABLE user_lab_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES pc_lab_simulations(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  time_spent INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, simulation_id)
);

-- Troubleshooting Scenarios Table
CREATE TABLE troubleshooting_scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  hints JSONB,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Troubleshooting Attempts Table
CREATE TABLE troubleshooting_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES troubleshooting_scenarios(id) ON DELETE CASCADE,
  solved BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  time_spent INTEGER,
  solved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements Table
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE troubleshooting_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_lab_progress
CREATE POLICY "Users can view own lab progress" ON user_lab_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lab progress" ON user_lab_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lab progress" ON user_lab_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for troubleshooting_attempts
CREATE POLICY "Users can view own troubleshooting attempts" ON troubleshooting_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own troubleshooting attempts" ON troubleshooting_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own troubleshooting attempts" ON troubleshooting_attempts FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for content tables
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Anyone can view quiz questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view pc lab simulations" ON pc_lab_simulations FOR SELECT USING (true);
CREATE POLICY "Anyone can view troubleshooting scenarios" ON troubleshooting_scenarios FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
