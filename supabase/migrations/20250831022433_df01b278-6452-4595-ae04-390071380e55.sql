-- Create content library table for storing video URLs and descriptions
CREATE TABLE public.content_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create presentations table for tracking presentation sessions
CREATE TABLE public.presentations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  presenter_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  current_content_id UUID REFERENCES public.content_library(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create presentation_history table for tracking commands and actions
CREATE TABLE public.presentation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  presentation_id UUID NOT NULL REFERENCES public.presentations(id) ON DELETE CASCADE,
  command_text TEXT NOT NULL,
  ai_response TEXT,
  content_displayed UUID REFERENCES public.content_library(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentation_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (can be restricted later)
CREATE POLICY "Content library is publicly readable" 
ON public.content_library 
FOR SELECT 
USING (true);

CREATE POLICY "Content library is publicly manageable" 
ON public.content_library 
FOR ALL 
USING (true);

CREATE POLICY "Presentations are publicly manageable" 
ON public.presentations 
FOR ALL 
USING (true);

CREATE POLICY "Presentation history is publicly manageable" 
ON public.presentation_history 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_content_library_updated_at
  BEFORE UPDATE ON public.content_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON public.presentations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample content for testing
INSERT INTO public.content_library (title, description, video_url, keywords) VALUES
('แผนการตลาดดิจิทัล', 'วิดีโออธิบายกลยุทธ์การตลาดออนไลน์และการใช้โซเชียลมีเดีย', 'https://example.com/marketing-strategy', ARRAY['การตลาด', 'ดิจิทัล', 'โซเชียล']),
('การทำแบรนด์ที่แข็งแกร่ง', 'เทคนิคการสร้างแบรนด์ที่โดดเด่นและจดจำได้', 'https://example.com/branding', ARRAY['แบรนด์', 'การตลาด', 'ธุรกิจ']),
('การวิเคราะห์ข้อมูลลูกค้า', 'วิธีการใช้ข้อมูลเพื่อเข้าใจพฤติกรรมของลูกค้า', 'https://example.com/customer-analysis', ARRAY['ข้อมูล', 'ลูกค้า', 'วิเคราะห์']);