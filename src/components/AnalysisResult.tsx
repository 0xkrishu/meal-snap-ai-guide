
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NutritionChart from "./NutritionChart";

interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface AnalysisResultProps {
  foodName: string;
  isHealthy: boolean;
  healthReason: string;
  nutrition: NutritionData;
  healthTip: string;
  imageUrl: string;
  portionSize?: string;
  ingredients?: string[];
  allergens?: string[];
  meme?: string;
}

const AnalysisResult = ({ 
  foodName, 
  isHealthy, 
  healthReason, 
  nutrition, 
  healthTip, 
  imageUrl,
  portionSize,
  ingredients,
  allergens,
  meme
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
                {portionSize && (
                  <Badge variant="outline" className="text-sm">
                    {portionSize}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-4">{healthReason}</p>
              
              {/* Quick nutrition overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{nutrition.calories}</div>
                  <div className="text-xs text-gray-600">Calories</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">{nutrition.carbs}g</div>
                  <div className="text-xs text-gray-600">Carbs</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-600">{nutrition.protein}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-xl font-bold text-yellow-600">{nutrition.fat}g</div>
                  <div className="text-xs text-gray-600">Fat</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fun Meme Section */}
      {meme && (
        <Card className="border-purple-100 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-lg text-purple-800">😂 Food Humor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700 text-center font-medium italic">{meme}</p>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Charts */}
      <NutritionChart nutrition={nutrition} />

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredients */}
        {ingredients && ingredients.length > 0 && (
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-lg">🥘 Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Allergens */}
        {allergens && allergens.length > 0 && (
          <Card className="border-red-100 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg text-red-800">⚠️ Allergens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen, index) => (
                  <Badge key={index} variant="destructive" className="text-sm">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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
