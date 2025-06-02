
import { supabase } from "@/integrations/supabase/client";

export const uploadImageAndAnalyze = async (file: File) => {
  try {
    // Convert file to base64 for OpenAI
    const base64 = await fileToBase64(file);
    const imageUrl = `data:${file.type};base64,${base64}`;

    // Call the edge function for analysis
    const { data, error } = await supabase.functions.invoke('analyze-food', {
      body: { imageUrl }
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      imageUrl: URL.createObjectURL(file) // Use local URL for display
    };
  } catch (error) {
    console.error('Error uploading and analyzing image:', error);
    throw error;
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
