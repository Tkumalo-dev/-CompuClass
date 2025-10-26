# Multi-Account Setup Guide

## Overview
Your app now supports two account types:
- **Student accounts**: Access learning materials, quizzes, and simulators
- **Lecturer accounts**: Upload quizzes, PDFs, PowerPoints, and organize content in folders

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy the SQL from `database/schema.sql`
4. Execute it to create tables and policies

### 3. Run the App
```bash
npm start
```

## Features

### For Lecturers:
- Create named folders/sections for organizing content
- Upload PDF documents
- Upload PowerPoint presentations
- Create quizzes with multiple-choice questions
- Delete folders, documents, and quizzes

### For Students:
- View all available folders and materials
- Access documents uploaded by lecturers
- Take quizzes created by lecturers
- Use PC Lab and Windows 11 simulator

## Account Creation
During signup, users select their role (Student or Lecturer). This determines their dashboard and permissions.

## File Storage
Documents are stored in Supabase Storage with public access for authenticated users.
