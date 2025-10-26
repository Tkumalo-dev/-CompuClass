# Database Setup Instructions

## Run this SQL in your Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Execute the SQL

This will create:
- **profiles** table: Stores user information with roles (student/lecturer)
- **folders** table: Lecturers can create named folders/sections
- **documents** table: Stores PDFs and PowerPoint files
- **quizzes** table: Stores quiz questions and answers
- **Storage bucket**: For file uploads
- **RLS policies**: Security rules for data access

## Required Dependencies

Add to package.json:
```bash
npm install expo-document-picker
```

This enables document picking for PDF and PowerPoint uploads.
