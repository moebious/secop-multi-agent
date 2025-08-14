-- Create an admin user directly in the database for testing
-- This bypasses email confirmation for development

-- First, let's create the auth user (this would normally be done by Supabase Auth)
-- Note: In production, users should sign up through the normal flow

-- Insert a test admin profile that can be used after manual user creation
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  company_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@example.com',
  'Admin User',
  'administrator',
  'Platform Admin',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'administrator',
  full_name = 'Admin User',
  company_name = 'Platform Admin';

-- Insert a test procurement officer
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  company_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'officer@example.com',
  'Procurement Officer',
  'procurement_officer',
  'Government Agency',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'procurement_officer',
  full_name = 'Procurement Officer',
  company_name = 'Government Agency';

-- Insert a test bidder
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  company_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'bidder@example.com',
  'Test Bidder',
  'bidder',
  'Construction Corp',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'bidder',
  full_name = 'Test Bidder',
  company_name = 'Construction Corp';
