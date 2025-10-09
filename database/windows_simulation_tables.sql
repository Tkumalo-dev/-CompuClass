-- Windows 11 Simulation Sessions Table
CREATE TABLE windows_simulation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  activities JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE windows_simulation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own simulation sessions" ON windows_simulation_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own simulation sessions" ON windows_simulation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own simulation sessions" ON windows_simulation_sessions FOR UPDATE USING (auth.uid() = user_id);
