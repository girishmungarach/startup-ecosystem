-- StartupEcosystem.in Database Setup
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  role TEXT,
  interests TEXT[] DEFAULT '{}',
  building TEXT,
  opportunities TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Jobs', 'Investment', 'Co-founder', 'Mentorship', 'Events', 'Partnerships')),
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  compensation TEXT,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opportunity_grabs table
CREATE TABLE IF NOT EXISTS opportunity_grabs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'contact_shared')),
  message TEXT,
  questionnaire_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(opportunity_id, user_id)
);

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  responder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, responder_id, opportunity_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bookmarked_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bookmarked_user_id)
);

-- Create questionnaires table
CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  questions JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questionnaire_responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  responses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(questionnaire_id, user_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunity_grabs_updated_at BEFORE UPDATE ON opportunity_grabs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questionnaires_updated_at BEFORE UPDATE ON questionnaires FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile trigger for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_grabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Opportunities policies
CREATE POLICY "Users can view all active opportunities" ON opportunities FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create opportunities" ON opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own opportunities" ON opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own opportunities" ON opportunities FOR DELETE USING (auth.uid() = user_id);

-- Opportunity grabs policies
CREATE POLICY "Users can view grabs for opportunities they own" ON opportunity_grabs FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_grabs.opportunity_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create grabs" ON opportunity_grabs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Opportunity owners can update grabs" ON opportunity_grabs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_grabs.opportunity_id AND user_id = auth.uid())
);

-- Connections policies
CREATE POLICY "Users can view their connections" ON connections FOR SELECT USING (
  auth.uid() = requester_id OR auth.uid() = responder_id
);
CREATE POLICY "Users can create connections" ON connections FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update their connections" ON connections FOR UPDATE USING (
  auth.uid() = requester_id OR auth.uid() = responder_id
);

-- Bookmarks policies
CREATE POLICY "Users can view their bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Questionnaires policies
CREATE POLICY "Users can view questionnaires for their opportunities" ON questionnaires FOR SELECT USING (
  EXISTS (SELECT 1 FROM opportunities WHERE id = questionnaires.opportunity_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create questionnaires for their opportunities" ON questionnaires FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM opportunities WHERE id = questionnaires.opportunity_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update questionnaires for their opportunities" ON questionnaires FOR UPDATE USING (
  EXISTS (SELECT 1 FROM opportunities WHERE id = questionnaires.opportunity_id AND user_id = auth.uid())
);

-- Questionnaire responses policies
CREATE POLICY "Users can view their own responses" ON questionnaire_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view responses for their questionnaires" ON questionnaire_responses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM questionnaires q 
    JOIN opportunities o ON q.opportunity_id = o.id 
    WHERE q.id = questionnaire_responses.questionnaire_id AND o.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create responses" ON questionnaire_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at);
CREATE INDEX IF NOT EXISTS idx_opportunity_grabs_opportunity_id ON opportunity_grabs(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_grabs_user_id ON opportunity_grabs(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_requester_id ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_responder_id ON connections(responder_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaires_opportunity_id ON questionnaires(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_questionnaire_id ON questionnaire_responses(questionnaire_id);

-- Insert sample data for testing
INSERT INTO profiles (id, full_name, email, company, role, interests, building, opportunities) VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Doe', 'john@example.com', 'TechCorp', 'Founder', ARRAY['Fintech', 'AI/ML'], 'Building a fintech platform', ARRAY['Investment', 'Partnerships']),
  ('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane@example.com', 'StartupXYZ', 'Investor', ARRAY['HealthTech', 'EdTech'], 'Looking for innovative startups', ARRAY['Investment', 'Mentorship']),
  ('00000000-0000-0000-0000-000000000003', 'Mike Johnson', 'mike@example.com', 'DevStudio', 'Developer', ARRAY['SaaS', 'Gaming'], 'Full-stack developer', ARRAY['Jobs', 'Co-founder'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO opportunities (id, user_id, title, type, company, location, description, requirements, compensation) VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Senior Full-Stack Developer', 'Jobs', 'TechCorp', 'Bangalore, India', 'We are looking for a talented full-stack developer to join our growing team.', 'React, Node.js, PostgreSQL, 3+ years experience', '₹15-25 LPA'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'Seed Investment Opportunity', 'Investment', 'StartupXYZ', 'Mumbai, India', 'Seeking seed funding for our innovative healthtech platform.', 'Early-stage startup, strong team, market validation', '₹50L - ₹2Cr'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'Co-founder for SaaS Platform', 'Co-founder', 'DevStudio', 'Delhi, India', 'Looking for a technical co-founder to build a B2B SaaS platform.', 'Technical skills, entrepreneurial mindset, commitment', 'Equity-based')
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully! 🎉' as status; 