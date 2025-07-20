-- StartupEcosystem.in Fixed Database Setup
-- Run this in your Supabase SQL Editor
-- This version works with Supabase authentication system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Create profiles table with enhanced fields
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
  bio TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  location TEXT,
  experience_years INTEGER,
  skills TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_experience_years CHECK (experience_years >= 0 AND experience_years <= 50)
);

-- Create opportunities table with enhanced fields
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
  application_deadline TIMESTAMP WITH TIME ZONE,
  equity_percentage NUMERIC(5,2), -- For investment/co-founder opportunities
  investment_range_min NUMERIC(12,2), -- For investment opportunities
  investment_range_max NUMERIC(12,2), -- For investment opportunities
  salary_range_min NUMERIC(10,2), -- For job opportunities
  salary_range_max NUMERIC(10,2), -- For job opportunities
  skills_required TEXT[] DEFAULT '{}',
  experience_level TEXT CHECK (experience_level IN ('Entry', 'Mid', 'Senior', 'Executive')),
  remote_work BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  grabs_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_equity_percentage CHECK (equity_percentage >= 0 AND equity_percentage <= 100),
  CONSTRAINT valid_investment_range CHECK (investment_range_min <= investment_range_max),
  CONSTRAINT valid_salary_range CHECK (salary_range_min <= salary_range_max),
  CONSTRAINT valid_contact_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create opportunity_grabs table with enhanced status tracking
CREATE TABLE IF NOT EXISTS opportunity_grabs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'contact_shared', 'withdrawn', 'expired')),
  message TEXT,
  questionnaire_response JSONB,
  resume_url TEXT,
  portfolio_url TEXT,
  expected_salary NUMERIC(10,2), -- For job opportunities
  investment_amount NUMERIC(12,2), -- For investment opportunities
  equity_offered NUMERIC(5,2), -- For co-founder opportunities
  availability_date DATE,
  is_urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_equity_offered CHECK (equity_offered >= 0 AND equity_offered <= 100),
  CONSTRAINT valid_investment_amount CHECK (investment_amount >= 0),
  CONSTRAINT valid_expected_salary CHECK (expected_salary >= 0),
  UNIQUE(opportunity_id, user_id)
);

-- Create connections table with enhanced relationship tracking
CREATE TABLE IF NOT EXISTS connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  responder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  connection_type TEXT CHECK (connection_type IN ('professional', 'mentorship', 'investment', 'partnership', 'friendship')),
  message TEXT,
  mutual_connection_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT different_users CHECK (requester_id != responder_id),
  UNIQUE(requester_id, responder_id, opportunity_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bookmarked_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bookmark_type TEXT DEFAULT 'profile' CHECK (bookmark_type IN ('profile', 'opportunity')),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT different_users CHECK (user_id != bookmarked_user_id),
  CONSTRAINT valid_bookmark_type CHECK (
    (bookmark_type = 'profile' AND opportunity_id IS NULL) OR
    (bookmark_type = 'opportunity' AND opportunity_id IS NOT NULL)
  ),
  UNIQUE(user_id, bookmarked_user_id, opportunity_id)
);

-- Create questionnaires table with enhanced question types
CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  is_required BOOLEAN DEFAULT true,
  max_responses INTEGER, -- Limit number of responses
  response_deadline TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_max_responses CHECK (max_responses > 0)
);

-- Create questionnaire_responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  responses JSONB NOT NULL,
  is_complete BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(questionnaire_id, user_id)
);

-- ============================================================================
-- ADDITIONAL FEATURE TABLES
-- ============================================================================

-- Create notifications table for real-time updates
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('opportunity_grab', 'connection_request', 'questionnaire_sent', 'contact_shared', 'opportunity_update', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data for the notification
  is_read BOOLEAN DEFAULT false,
  is_email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for direct messaging
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'link')),
  file_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT different_users CHECK (sender_id != receiver_id)
);

-- Create events table for startup events
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT CHECK (event_type IN ('Meetup', 'Conference', 'Hackathon', 'Pitch Competition', 'Workshop', 'Networking')),
  location TEXT,
  virtual_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_attendees INTEGER,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (start_date < end_date),
  CONSTRAINT valid_max_attendees CHECK (max_attendees > 0)
);

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'waitlist')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(event_id, user_id)
);

-- Create tags table for better categorization
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN ('Industry', 'Technology', 'Role', 'Location', 'Skill')),
  color TEXT DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opportunity_tags junction table
CREATE TABLE IF NOT EXISTS opportunity_tags (
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (opportunity_id, tag_id)
);

-- Create profile_tags junction table
CREATE TABLE IF NOT EXISTS profile_tags (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (profile_id, tag_id)
);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

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
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile trigger for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), NEW.email);
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update opportunity stats
CREATE OR REPLACE FUNCTION update_opportunity_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE opportunities 
    SET grabs_count = grabs_count + 1 
    WHERE id = NEW.opportunity_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE opportunities 
    SET grabs_count = grabs_count - 1 
    WHERE id = OLD.opportunity_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for opportunity grab stats
CREATE TRIGGER update_opportunity_grab_stats
  AFTER INSERT OR DELETE ON opportunity_grabs
  FOR EACH ROW EXECUTE FUNCTION update_opportunity_stats();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_grabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_tags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles" ON profiles FOR SELECT USING (is_public = true OR auth.uid() = id);
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
CREATE POLICY "Users can delete own grabs" ON opportunity_grabs FOR DELETE USING (auth.uid() = user_id);

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

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can create messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their sent messages" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- Events policies
CREATE POLICY "Users can view all active events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = organizer_id);

-- Event attendees policies
CREATE POLICY "Users can view event attendees" ON event_attendees FOR SELECT USING (true);
CREATE POLICY "Users can register for events" ON event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registration" ON event_attendees FOR UPDATE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Users can view all tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Users can create tags" ON tags FOR INSERT WITH CHECK (true);

-- Junction tables policies
CREATE POLICY "Users can view opportunity tags" ON opportunity_tags FOR SELECT USING (true);
CREATE POLICY "Users can manage tags for own opportunities" ON opportunity_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_tags.opportunity_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view profile tags" ON profile_tags FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile tags" ON profile_tags FOR ALL USING (auth.uid() = profile_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_company ON profiles(company);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON profiles USING GIN(interests);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);

-- Opportunities indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_company ON opportunities(company);
CREATE INDEX IF NOT EXISTS idx_opportunities_location ON opportunities(location);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_active ON opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_featured ON opportunities(is_featured);
CREATE INDEX IF NOT EXISTS idx_opportunities_skills_required ON opportunities USING GIN(skills_required);
CREATE INDEX IF NOT EXISTS idx_opportunities_experience_level ON opportunities(experience_level);
CREATE INDEX IF NOT EXISTS idx_opportunities_remote_work ON opportunities(remote_work);
CREATE INDEX IF NOT EXISTS idx_opportunities_application_deadline ON opportunities(application_deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_salary_range ON opportunities(salary_range_min, salary_range_max);
CREATE INDEX IF NOT EXISTS idx_opportunities_investment_range ON opportunities(investment_range_min, investment_range_max);

-- Opportunity grabs indexes
CREATE INDEX IF NOT EXISTS idx_opportunity_grabs_opportunity_id ON opportunity_grabs(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_grabs_user_id ON opportunity_grabs(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_grabs_status ON opportunity_grabs(status);
CREATE INDEX IF NOT EXISTS idx_opportunity_grabs_created_at ON opportunity_grabs(created_at);

-- Connections indexes
CREATE INDEX IF NOT EXISTS idx_connections_requester_id ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_responder_id ON connections(responder_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_connection_type ON connections(connection_type);

-- Bookmarks indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_bookmark_type ON bookmarks(bookmark_type);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at);

-- Questionnaires indexes
CREATE INDEX IF NOT EXISTS idx_questionnaires_opportunity_id ON questionnaires(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_questionnaires_is_active ON questionnaires(is_active);
CREATE INDEX IF NOT EXISTS idx_questionnaires_response_deadline ON questionnaires(response_deadline);

-- Questionnaire responses indexes
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_questionnaire_id ON questionnaire_responses(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_user_id ON questionnaire_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_submitted_at ON questionnaire_responses(submitted_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);

-- Event attendees indexes
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON event_attendees(status);

-- Tags indexes
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_search ON opportunities USING GIN(to_tsvector('english', title || ' ' || description || ' ' || company));
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING GIN(to_tsvector('english', full_name || ' ' || COALESCE(company, '') || ' ' || COALESCE(bio, '')));

-- ============================================================================
-- SAMPLE DATA (TAGS ONLY - NO PROFILE DATA)
-- ============================================================================

-- Insert sample tags (these don't require user authentication)
INSERT INTO tags (name, category, color) VALUES
  ('Fintech', 'Industry', '#3B82F6'),
  ('HealthTech', 'Industry', '#10B981'),
  ('EdTech', 'Industry', '#F59E0B'),
  ('AI/ML', 'Technology', '#8B5CF6'),
  ('React', 'Technology', '#06B6D4'),
  ('Node.js', 'Technology', '#059669'),
  ('Founder', 'Role', '#DC2626'),
  ('Investor', 'Role', '#7C3AED'),
  ('Developer', 'Role', '#2563EB'),
  ('Bangalore', 'Location', '#EA580C'),
  ('Mumbai', 'Location', '#DB2777'),
  ('Delhi', 'Location', '#059669'),
  ('SaaS', 'Industry', '#8B5CF6'),
  ('Gaming', 'Industry', '#F59E0B'),
  ('AgriTech', 'Industry', '#10B981'),
  ('Python', 'Technology', '#059669'),
  ('AWS', 'Technology', '#FF9900'),
  ('Designer', 'Role', '#EC4899'),
  ('Marketing', 'Role', '#8B5CF6'),
  ('Sales', 'Role', '#10B981'),
  ('Operations', 'Role', '#F59E0B'),
  ('Student', 'Role', '#6B7280'),
  ('Hyderabad', 'Location', '#DC2626'),
  ('Chennai', 'Location', '#7C3AED'),
  ('Pune', 'Location', '#2563EB')
ON CONFLICT (name) DO NOTHING;

-- Success message
SELECT 'Fixed database setup completed successfully! 🎉' as status; 