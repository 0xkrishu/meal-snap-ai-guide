
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
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional nutritionist and food analysis expert with a sense of humor. Analyze the food image and provide detailed nutritional information. Always include a funny food-related meme or joke in your response. Return ONLY a valid JSON object with this exact structure:
{
  "foodName": "string",
  "isHealthy": boolean,
  "healthReason": "string",
  "nutrition": {
    "calories": number,
    "carbs": number,
    "protein": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  },
  "healthTip": "string",
  "portionSize": "string",
  "ingredients": ["string"],
  "allergens": ["string"],
  "meme": "string - a funny food-related joke or meme text"
}`
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
        }),
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

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    console.log('OpenAI response:', analysisText);

    // Parse the JSON response with error handling
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
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
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze food image', 
        details: error.message 
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
