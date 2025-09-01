-- Add sample content for testing the AI Presentation Agent
INSERT INTO content_library (title, description, video_url, keywords) VALUES 
('Crown Diamond Station Overview', 'รู้จักกับ Crown Diamond Station - WCI-CoreNetwork และระบบเครือข่ายขั้นสูง', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['crown diamond', 'network', 'overview', 'introduction']),
('Network Security Training', 'การอบรมด้านความปลอดภัยเครือข่าย เทคนิคการป้องกันภัยคุกคาม', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['security', 'training', 'network', 'protection']),
('Business Expansion Strategy', 'กลยุทธ์การขยายธุรกิจและการเติบโตอย่างยั่งยืน', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['business', 'expansion', 'strategy', 'growth']),
('Technical Infrastructure', 'โครงสร้างพื้นฐานทางเทคนิคและการจัดการระบบ', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['technical', 'infrastructure', 'system', 'management']),
('Customer Success Stories', 'เรื่องราวความสำเร็จของลูกค้าและการใช้งานจริง', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['customer', 'success', 'stories', 'testimonial']),
('Partnership Opportunities', 'โอกาสในการเป็นพันธมิตรและการร่วมมือทางธุรกิจ', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['partnership', 'opportunities', 'collaboration', 'business']),
('Training Programs', 'โปรแกรมการฝึกอบรมและพัฒนาทักษะ', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['training', 'programs', 'development', 'skills']);

-- Create a sample presentation
INSERT INTO presentations (title, presenter_name, status) VALUES 
('Crown Diamond Station Business Presentation', 'AI Presentation Agent', 'active');