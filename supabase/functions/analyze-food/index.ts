import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing food image with OpenAI...');

    // Helper to extract JSON from a string, robust to markdown code fences
    function extractJSON(text) {
      // Remove all markdown code fences (```json, ```, etc.)
      text = text.replace(/```json|```/gi, '');
      // Now extract the JSON object
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch (e) {
          return null;
        }
      }
      return null;
    }

    // Retry logic for rate limiting
    let retries = 3;
    let response;
    
    while (retries > 0) {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'system',
              content: `You are a professional nutritionist and food analysis expert. Analyze the food image and provide detailed nutritional information. Return ONLY the JSON object, with NO markdown, code fences, or extra text. If you cannot analyze, still return a valid JSON object with a reason.\n\nJSON structure:\n{\n  "foodName": "string",\n  "isHealthy": boolean,\n  "healthReason": "string",\n  "nutrition": {\n    "calories": number,\n    "carbs": number,\n    "protein": number,\n    "fat": number,\n    "fiber": number,\n    "sugar": number,\n    "sodium": number\n  },\n  "healthTip": "string",\n  "portionSize": "string",\n  "ingredients": ["string"],\n  "allergens": ["string"],\n  "meme": "string - a funny food-related joke or meme text"\n}`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this food image and provide detailed nutritional information. Be as accurate as possible with the nutrition values based on typical serving sizes. Also include a funny food-related meme or joke!'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      });

      if (response.ok) {
        break;
      }

      if (response.status === 429) {
        retries--;
        if (retries > 0) {
          console.log(`Rate limited, retrying in ${4 - retries} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (4 - retries) * 1000));
          continue;
        }
      }

      throw new Error(`OpenAI API error: ${response.status} - ${await response.text()}`);
    }

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    let analysisText = '';
    try {
      const data = await response.json();
      analysisText = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content ? data.choices[0].message.content : '';
      console.log('OpenAI response status:', response.status);
      console.log('OpenAI response body:', JSON.stringify(data, null, 2));
    } catch (jsonErr) {
      const errorBody = await response.text();
      console.error('Failed to parse OpenAI response as JSON. Raw body:', errorBody);
      throw new Error('OpenAI API did not return valid JSON.');
    }
    
    console.log('OpenAI extracted analysisText:', analysisText);

    // Parse the JSON response with error handling
    let analysis = extractAndParse(analysisText);
    if (!analysis) {
      // Fallback response if parsing fails
      analysis = {
        foodName: "Unknown Food",
        isHealthy: true,
        healthReason: "Unable to analyze at this time",
        nutrition: {
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0
        },
        healthTip: "Please try again with a clearer image",
        portionSize: "1 serving",
        ingredients: ["Unknown"],
        allergens: [],
        meme: "Why did the tomato turn red? Because it saw the salad dressing! 🍅😂"
      };
    }

    // Save to database with enhanced data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        const { error } = await supabase
          .from('food_analyses')
          .insert({
            user_id: user.id,
            image_url: imageUrl,
            food_name: analysis.foodName,
            is_healthy: analysis.isHealthy,
            health_reason: analysis.healthReason,
            calories: analysis.nutrition.calories,
            carbs: analysis.nutrition.carbs,
            protein: analysis.nutrition.protein,
            fat: analysis.nutrition.fat,
            health_tip: analysis.healthTip
          });

        if (error) {
          console.error('Error saving to database:', error);
        } else {
          console.log('Analysis saved to database successfully');
        }
      }
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-food function:', error);
    // Try to include OpenAI or parsing error details if available
    let errorMessage = error && error.message ? error.message : String(error);
    if (error && error.response) {
      try {
        const errorData = await error.response.json();
        errorMessage += ` | OpenAI: ${JSON.stringify(errorData)}`;
      } catch {}
    }
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze food image', 
        details: errorMessage 
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractAndParse(response) {
  try {
    // Remove everything before the first `{`
    const jsonStart = response.indexOf('{');
    const jsonString = response.slice(jsonStart).replace(/```/g, '').trim();

    // Parse JSON
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Error parsing OpenAI response:", err.message);
    return null;
  }
}

// Example usage:
const raw = '```json { "foodName": "Samosas", "isHealthy": false, "healthReason": "High in calories" } ```';
const parsed = extractAndParse(raw);
console.log(parsed);