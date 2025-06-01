
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface AnalysisResultProps {
  foodName: string;
  isHealthy: boolean;
  healthReason: string;
  nutrition: NutritionData;
  healthTip: string;
  imageUrl: string;
}

const AnalysisResult = ({ 
  foodName, 
  isHealthy, 
  healthReason, 
  nutrition, 
  healthTip, 
  imageUrl 
}: AnalysisResultProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Image and Basic Info */}
      <Card className="border-green-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src={imageUrl} 
                alt={foodName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{foodName}</h2>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={isHealthy ? "default" : "destructive"} className="text-sm">
                  {isHealthy ? "Healthy" : "Not Healthy"}
                </Badge>
              </div>
              <p className="text-gray-600">{healthReason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Facts */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-lg">Nutrition Facts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{nutrition.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{nutrition.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{nutrition.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{nutrition.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Tip */}
      <Card className="border-green-100 bg-green-50">
        <CardHeader>
          <CardTitle className="text-lg text-green-800">💡 Health Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">{healthTip}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResult;
