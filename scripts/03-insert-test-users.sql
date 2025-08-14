-- Insert test users for admin dashboard testing
-- Note: These are dummy accounts for testing purposes only

-- Insert test users into auth.users (this simulates Supabase auth)
-- In a real scenario, these would be created through the signup process

-- Insert profiles for test users
INSERT INTO public.profiles (id, email, full_name, role, company_name, phone, created_at, updated_at) VALUES
-- Admin user
('550e8400-e29b-41d4-a716-446655440001', 'admin@test.com', 'Admin Usuario', 'administrator', 'Plataforma Admin', '+57 300 123 4567', NOW(), NOW()),

-- Procurement Officer
('550e8400-e29b-41d4-a716-446655440002', 'officer@test.com', 'María González', 'procurement_officer', 'Ministerio de Hacienda', '+57 301 234 5678', NOW(), NOW()),

-- Bidder 1
('550e8400-e29b-41d4-a716-446655440003', 'bidder1@test.com', 'Carlos Rodríguez', 'bidder', 'Constructora ABC S.A.S', '+57 302 345 6789', NOW(), NOW()),

-- Bidder 2
('550e8400-e29b-41d4-a716-446655440004', 'bidder2@test.com', 'Ana Martínez', 'bidder', 'Tecnología XYZ Ltda', '+57 303 456 7890', NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Insert some sample procurements for testing
INSERT INTO public.procurements (
  id, title, description, entity_name, entity_id, contract_value, 
  department, start_date, end_date, process_id, status, created_at, updated_at
) VALUES
('proc-001', 'Construcción de Puente Vehicular', 'Construcción de puente vehicular sobre el río Magdalena en el municipio de Honda, Tolima', 'INVÍAS', 'INV-2024-001', 15000000000, 'Tolima', '2024-01-15', '2024-12-31', 'SECOP-2024-001', 'active', NOW(), NOW()),
('proc-002', 'Suministro de Equipos de Cómputo', 'Adquisición de 500 computadores portátiles para instituciones educativas', 'Ministerio de Educación', 'MINED-2024-002', 2500000000, 'Bogotá D.C.', '2024-02-01', '2024-06-30', 'SECOP-2024-002', 'active', NOW(), NOW()),
('proc-003', 'Servicios de Consultoría en TI', 'Consultoría para implementación de sistema de gestión documental', 'DIAN', 'DIAN-2024-003', 800000000, 'Bogotá D.C.', '2024-01-20', '2024-08-20', 'SECOP-2024-003', 'active', NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert some sample bids for testing
INSERT INTO public.bids (
  id, procurement_id, bidder_id, title, description, proposed_value, 
  technical_score, financial_score, status, submitted_at, created_at, updated_at
) VALUES
('bid-001', 'proc-001', '550e8400-e29b-41d4-a716-446655440003', 'Propuesta Constructora ABC', 'Propuesta técnica y económica para construcción de puente vehicular con tecnología de última generación', 14500000000, 85, 92, 'submitted', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days', NOW()),
('bid-002', 'proc-001', '550e8400-e29b-41d4-a716-446655440004', 'Propuesta Tecnología XYZ', 'Solución innovadora para construcción de puente con materiales sostenibles', 14800000000, 78, 88, 'submitted', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days', NOW()),
('bid-003', 'proc-002', '550e8400-e29b-41d4-a716-446655440003', 'Suministro Equipos ABC', 'Propuesta para suministro de computadores con garantía extendida', 2400000000, 90, 95, 'submitted', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days', NOW()),
('bid-004', 'proc-003', '550e8400-e29b-41d4-a716-446655440004', 'Consultoría TI XYZ', 'Servicios de consultoría especializada en gestión documental', 750000000, 88, 93, 'draft', NOW(), NOW() - INTERVAL '1 day', NOW())

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert some sample notifications
INSERT INTO public.notifications (
  id, user_id, title, message, type, read, created_at
) VALUES
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'Nueva licitación disponible', 'Se ha publicado una nueva oportunidad de contratación: Construcción de Puente Vehicular', 'info', false, NOW() - INTERVAL '1 hour'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'Propuesta recibida', 'Se ha recibido una nueva propuesta para evaluación en el proceso SECOP-2024-001', 'success', false, NOW() - INTERVAL '30 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'Propuesta enviada', 'Tu propuesta para Construcción de Puente Vehicular ha sido enviada exitosamente', 'success', true, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'Evaluación completada', 'La evaluación de tu propuesta ha sido completada. Revisa los resultados en tu dashboard', 'info', false, NOW() - INTERVAL '1 day');
