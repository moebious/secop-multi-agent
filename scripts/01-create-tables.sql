-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('bidder', 'procurement_officer', 'administrator');

-- Create enum for bid status
CREATE TYPE bid_status AS ENUM ('draft', 'submitted', 'under_review', 'accepted', 'rejected');

-- Create enum for procurement status
CREATE TYPE procurement_status AS ENUM ('open', 'closed', 'awarded', 'cancelled');

-- Create profiles table to extend Supabase auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'bidder',
  company_name TEXT,
  company_registration TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create procurements table for SECOP II data
CREATE TABLE procurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  secop_id TEXT UNIQUE NOT NULL, -- SECOP II procurement ID
  title TEXT NOT NULL,
  description TEXT,
  buyer_name TEXT NOT NULL,
  buyer_id TEXT,
  tender_value DECIMAL(15,2),
  currency TEXT DEFAULT 'COP',
  status procurement_status DEFAULT 'open',
  publication_date TIMESTAMP WITH TIME ZONE,
  closing_date TIMESTAMP WITH TIME ZONE,
  award_date TIMESTAMP WITH TIME ZONE,
  category TEXT,
  location TEXT,
  ocds_data JSONB, -- Store full OCDS data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bids table
CREATE TABLE bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  procurement_id UUID REFERENCES procurements(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bid_amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'COP',
  status bid_status DEFAULT 'draft',
  proposal_document_url TEXT,
  technical_score DECIMAL(5,2),
  financial_score DECIMAL(5,2),
  total_score DECIMAL(5,2),
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(procurement_id, bidder_id) -- One bid per bidder per procurement
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  read BOOLEAN DEFAULT FALSE,
  procurement_id UUID REFERENCES procurements(id) ON DELETE SET NULL,
  bid_id UUID REFERENCES bids(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_procurements_status ON procurements(status);
CREATE INDEX idx_procurements_closing_date ON procurements(closing_date);
CREATE INDEX idx_bids_procurement_id ON bids(procurement_id);
CREATE INDEX idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Procurements: All authenticated users can read, only admins and procurement officers can modify
CREATE POLICY "All users can view procurements" ON procurements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and officers can manage procurements" ON procurements FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('administrator', 'procurement_officer')
  )
);

-- Bids: Users can see their own bids, procurement officers can see all bids for their procurements
CREATE POLICY "Users can view own bids" ON bids FOR SELECT USING (
  bidder_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('administrator', 'procurement_officer')
  )
);
CREATE POLICY "Bidders can manage own bids" ON bids FOR ALL USING (bidder_id = auth.uid());

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
