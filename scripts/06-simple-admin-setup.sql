-- Simple admin user setup for testing
-- This creates profiles that can be used after normal Supabase Auth signup

-- Create admin profile (use this email when signing up)
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  company_name,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@test.local',
  'Platform Administrator',
  'administrator',
  'Platform Management',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'administrator',
  full_name = 'Platform Administrator',
  company_name = 'Platform Management';

-- Add some sample procurement data for testing
INSERT INTO procurements (
  id,
  secop_id,
  title,
  description,
  category,
  tender_value,
  currency,
  status,
  buyer_name,
  buyer_id,
  location,
  publication_date,
  closing_date,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'SECOP-2024-001',
  'Construcción de Infraestructura Vial',
  'Proyecto para la construcción y mejoramiento de vías urbanas en el municipio',
  'Construcción',
  5000000000,
  'COP',
  'open',
  'Alcaldía Municipal',
  'GOV-001',
  'Bogotá, Colombia',
  now() - interval '2 days',
  now() + interval '15 days',
  now(),
  now()
),
(
  gen_random_uuid(),
  'SECOP-2024-002',
  'Suministro de Equipos Médicos',
  'Adquisición de equipos médicos especializados para hospital público',
  'Salud',
  2500000000,
  'COP',
  'open',
  'Hospital Nacional',
  'GOV-002',
  'Medellín, Colombia',
  now() - interval '1 day',
  now() + interval '20 days',
  now(),
  now()
);
