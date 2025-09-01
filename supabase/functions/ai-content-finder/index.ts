import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

if (!openAIApiKey) {
  console.error('OpenAI API key is not set');
}
const supabaseUrl = 'https://cqlhwmxykmjrcdzwknel.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbGh3bXh5a21qcmNkendrbmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MjI2OTcsImV4cCI6MjA3MjA5ODY5N30.h-0XdUkoXlj8mry28LMQnNtHs_hUer380b1LbEYg1aE';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command, presentationId } = await req.json();
    console.log('AI Command received:', command);

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all content from the library
    const { data: contentLibrary, error: contentError } = await supabase
      .from('content_library')
      .select('*');

    if (contentError) {
      throw new Error(`Database error: ${contentError.message}`);
    }

    // Use OpenAI to analyze the command and find the most relevant content
    const contentDescriptions = contentLibrary.map(item => 
      `ID: ${item.id}, Title: ${item.title}, Description: ${item.description}, Keywords: ${item.keywords?.join(', ')}`
    ).join('\n');

    let aiResult;
    
    if (!openAIApiKey) {
      // Fallback: Simple keyword matching when OpenAI is not available
      const commandLower = command.toLowerCase();
      const matchedContent = contentLibrary.find(item => {
        const titleMatch = item.title.toLowerCase().includes(commandLower);
        const descMatch = item.description.toLowerCase().includes(commandLower);
        const keywordMatch = item.keywords?.some(keyword => 
          keyword.toLowerCase().includes(commandLower) || commandLower.includes(keyword.toLowerCase())
        );
        return titleMatch || descMatch || keywordMatch;
      });

      aiResult = {
        selectedContentId: matchedContent?.id || null,
        response: matchedContent 
          ? `พบเนื้อหาที่เหมาะสม: ${matchedContent.title} - ${matchedContent.description}`
          : `ไม่พบเนื้อหาที่ตรงกับคำสั่ง "${command}" กรุณาลองใช้คำค้นหาอื่น`,
        suggestion: matchedContent 
          ? "คลิกเพื่อดูเนื้อหานี้ หรือลองค้นหาเนื้อหาอื่นที่เกี่ยวข้อง"
          : "ลองใช้คำศัพท์เช่น 'crown diamond', 'network', 'security', 'business', 'training'"
      };
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `คุณเป็น AI Assistant สำหรับระบบนำเสนอของ Crown Diamond Station - WCI-CoreNetwork
              ภารกิจของคุณคือวิเคราะห์คำสั่งจากผู้นำเสนอ และหาเนื้อหาที่เหมาะสมที่สุดจากคลังเนื้อหา
              
              คลังเนื้อหาที่มี:
              ${contentDescriptions}
              
              ให้ตอบกลับในรูปแบบ JSON ดังนี้:
              {
                "selectedContentId": "UUID ของเนื้อหาที่เลือก หรือ null ถ้าไม่พบเนื้อหาที่เหมาะสม",
                "response": "คำตอบที่เป็นมิตรและชี้แจงว่าทำไมเลือกเนื้อหานี้ หรือแนะนำทางเลือกอื่น",
                "suggestion": "คำแนะนำเพิ่มเติมสำหรับการนำเสนอ"
              }`
            },
            {
              role: 'user',
              content: command
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const aiResponse = await response.json();
      aiResult = JSON.parse(aiResponse.choices[0].message.content);
    }

    // Get the selected content details if any
    let selectedContent = null;
    if (aiResult.selectedContentId) {
      const contentResult = await supabase
        .from('content_library')
        .select('*')
        .eq('id', aiResult.selectedContentId)
        .single();
      
      if (!contentResult.error) {
        selectedContent = contentResult.data;
      }
    }

    // Save the interaction to history
    if (presentationId) {
      await supabase
        .from('presentation_history')
        .insert({
          presentation_id: presentationId,
          command_text: command,
          ai_response: aiResult.response,
          content_displayed: aiResult.selectedContentId
        });
    }

    return new Response(JSON.stringify({
      success: true,
      aiResponse: aiResult.response,
      suggestion: aiResult.suggestion,
      selectedContent,
      contentLibrary: contentLibrary
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-content-finder function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});