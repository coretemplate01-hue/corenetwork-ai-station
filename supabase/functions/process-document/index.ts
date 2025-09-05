import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = 'https://cqlhwmxykmjrcdzwknel.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbGh3bXh5a21qcmNkendrbmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MjI2OTcsImV4cCI6MjA3MjA5ODY5N30.h-0XdUkoXlj8mry28LMQnNtHs_hUer380b1LbEYg1aE';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the authorization header and verify user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { documentId } = await req.json();
    console.log('Processing document:', documentId);

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from('knowledge_documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      throw new Error('Document not found');
    }

    // Download file content from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(document.file_path);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Extract text content (basic implementation - for production, use proper PDF/DOC parsers)
    const text = await fileData.text();
    
    // Split text into chunks for better embedding
    const chunks = splitTextIntoChunks(text, 1000);
    
    // Create embeddings using OpenAI
    const embeddings: number[][] = [];
    
    for (const chunk of chunks) {
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: chunk,
        }),
      });

      if (!embeddingResponse.ok) {
        throw new Error(`OpenAI API error: ${embeddingResponse.status}`);
      }

      const embeddingData = await embeddingResponse.json();
      embeddings.push(embeddingData.data[0].embedding);
    }

    // For simplicity, use the first chunk's embedding as the document embedding
    const documentEmbedding = embeddings[0];

    // Update document with processed content and embedding
    const { error: updateError } = await supabase
      .from('knowledge_documents')
      .update({
        content_text: text,
        embeddings: documentEmbedding,
        processed: true,
      })
      .eq('id', documentId);

    if (updateError) {
      throw new Error(`Failed to update document: ${updateError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Document processed successfully',
      chunksProcessed: chunks.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-document function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if (currentChunk.length + word.length + 1 > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = word;
      } else {
        // Word is longer than maxChunkSize, add it anyway
        chunks.push(word);
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}