import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Call OpenAI Vision API to analyze the image
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
            content: `You are a product cataloging assistant. Analyze the uploaded image and generate appropriate product details for an e-commerce photo frame store. 

Return ONLY a valid JSON object with these exact fields:
{
  "title": "Descriptive product title (max 60 chars)",
  "description": "Detailed product description (100-200 words)",
  "slug": "url-friendly-slug-using-hyphens"
}

Focus on photo frames, artwork, or printable designs. If the image shows something that could be framed or printed, describe it as a product ready for framing.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this image and generate product details for a photo frame store:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'low'
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      // Parse the JSON response from OpenAI
      const productDetails = JSON.parse(content);
      
      // Validate required fields
      if (!productDetails.title || !productDetails.description || !productDetails.slug) {
        throw new Error('Invalid response format from AI');
      }

      return new Response(JSON.stringify(productDetails), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      
      // Fallback response if JSON parsing fails
      return new Response(JSON.stringify({
        title: "Beautiful Frame Design",
        description: "A stunning design perfect for framing and decoration. This high-quality print will enhance any space with its elegant appearance and timeless appeal.",
        slug: "beautiful-frame-design"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in auto-fill-product function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});