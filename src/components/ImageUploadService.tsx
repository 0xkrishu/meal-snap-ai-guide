
import { supabase } from "@/integrations/supabase/client";

export const uploadImageAndAnalyze = async (file: File) => {
  try {
    // Convert file to base64 for OpenAI
    const base64 = await fileToBase64(file);
    const imageUrl = `data:${file.type};base64,${base64}`;

    console.log('Starting image analysis...');

    // Call the edge function for analysis
    const { data, error } = await supabase.functions.invoke('analyze-food', {
      body: { imageUrl }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to analyze image');
    }

    if (!data) {
      throw new Error('No data received from analysis');
    }

    console.log('Analysis complete:', data);

    return {
      ...data,
      imageUrl: URL.createObjectURL(file) // Use local URL for display
    };
  } catch (error) {
    console.error('Error uploading and analyzing image:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('429')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (error.message?.includes('401')) {
      throw new Error('Authentication failed. Please check your API key.');
    } else if (error.message?.includes('400')) {
      throw new Error('Invalid image format. Please try a different image.');
    } else {
      throw new Error(error.message || 'Failed to analyze image. Please try again.');
    }
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};
