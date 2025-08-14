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
  secop_id TEXT UNIQUE NOT NULL,
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
  ocds_data JSONB,
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
  UNIQUE(procurement_id, bidder_id)
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
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

-- Create simplified RLS policies
-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable update for users based on user_id" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users only" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Procurements: All authenticated users can read
CREATE POLICY "Enable read access for authenticated users" ON procurements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON procurements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON procurements FOR UPDATE USING (auth.role() = 'authenticated');

-- Bids: Users can manage their own bids
CREATE POLICY "Enable read access for own bids" ON bids FOR SELECT USING (bidder_id = auth.uid());
CREATE POLICY "Enable insert for own bids" ON bids FOR INSERT WITH CHECK (bidder_id = auth.uid());
CREATE POLICY "Enable update for own bids" ON bids FOR UPDATE USING (bidder_id = auth.uid());
CREATE POLICY "Enable delete for own bids" ON bids FOR DELETE USING (bidder_id = auth.uid());

-- Notifications: Users can only see their own notifications
CREATE POLICY "Enable read access for own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Enable update for own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Enable insert for authenticated users" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
