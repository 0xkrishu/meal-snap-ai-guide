
import { useState } from "react";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";
import AnalysisResult from "@/components/AnalysisResult";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { uploadImageAndAnalyze } from "@/components/ImageUploadService";

const Dashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    try {
      console.log('Starting food analysis...');
      const result = await uploadImageAndAnalyze(file);
      
      setAnalysisResult(result);
      
      toast({
        title: "Analysis complete!",
        description: "Your meal has been successfully analyzed.",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
      setUploadedImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Analysis Dashboard</h1>
          <p className="text-gray-600">Upload a photo of your meal to get instant AI-powered nutrition insights</p>
        </div>

        {!analysisResult && !isAnalyzing && (
          <UploadZone onImageUpload={handleImageUpload} />
        )}

        {isAnalyzing && (
          <Card className="border-green-100">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <h3 className="text-lg font-semibold text-gray-900">AI is analyzing your meal...</h3>
                <p className="text-gray-600">Our AI is identifying the food and calculating detailed nutrition facts</p>
                {uploadedImage && (
                  <div className="mt-6">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded meal"
                      className="w-48 h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {analysisResult && (
          <div className="space-y-6">
            <AnalysisResult {...analysisResult} />
            
            <div className="text-center">
              <button
                onClick={handleNewAnalysis}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Analyze Another Meal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
