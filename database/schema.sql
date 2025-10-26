-- Update existing profiles table to add lecturer role
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'admin', 'lecturer'));

-- Folders table for organizing content
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  lecturer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table for PDFs and PowerPoints
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  lecturer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Lecturers can upload documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Anyone can view documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'avatars');

-- Row Level Security policies
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecturers can create folders" ON folders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = lecturer_id);

CREATE POLICY "Lecturers can view their folders" ON folders
  FOR SELECT TO authenticated
  USING (auth.uid() = lecturer_id);

CREATE POLICY "Students can view all folders" ON folders
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Lecturers can delete their folders" ON folders
  FOR DELETE TO authenticated
  USING (auth.uid() = lecturer_id);

CREATE POLICY "Lecturers can upload documents" ON documents
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = lecturer_id);

CREATE POLICY "Everyone can view documents" ON documents
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Lecturers can delete their documents" ON documents
  FOR DELETE TO authenticated
  USING (auth.uid() = lecturer_id);

-- RLS for existing quizzes table
CREATE POLICY "Lecturers can create quizzes in folders" ON quizzes
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM folders WHERE id = folder_id AND lecturer_id = auth.uid()
  ));

CREATE POLICY "Lecturers can delete their folder quizzes" ON quizzes
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM folders WHERE id = folder_id AND lecturer_id = auth.uid()
  ));

-- Update trigger to handle lecturer role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE
  SET role = COALESCE(NEW.raw_user_meta_data->>'role', profiles.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
