
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  date: string;
  foodName: string;
  isHealthy: boolean;
  calories: number;
  imageUrl: string;
}

const History = () => {
  // Mock data - in real app, fetch from Supabase
  const [historyItems] = useState<HistoryItem[]>([
    {
      id: "1",
      date: "2024-06-01",
      foodName: "Grilled Chicken Salad",
      isHealthy: true,
      calories: 420,
      imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop&auto=format"
    },
    {
      id: "2", 
      date: "2024-05-31",
      foodName: "Chocolate Cake",
      isHealthy: false,
      calories: 650,
      imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop&auto=format"
    },
    {
      id: "3",
      date: "2024-05-31",
      foodName: "Quinoa Buddha Bowl",
      isHealthy: true,
      calories: 380,
      imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop&auto=format"
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h1>
          <p className="text-gray-600">View your previous meal analyses and nutrition insights</p>
        </div>

        {historyItems.length === 0 ? (
          <Card className="border-green-100">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">📷</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No analyses yet</h3>
                <p className="text-gray-600">Upload your first meal photo to start tracking your nutrition!</p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Analyze Your First Meal
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {historyItems.map((item) => (
              <Card key={item.id} className="border-green-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-32 h-32 flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.foodName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.foodName}</h3>
                        <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant={item.isHealthy ? "default" : "destructive"} className="text-sm">
                          {item.isHealthy ? "Healthy" : "Not Healthy"}
                        </Badge>
                        <span className="text-sm text-gray-600">{item.calories} calories</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-gray-600 hover:bg-gray-50"
                        >
                          Analyze Similar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {historyItems.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {historyItems.length} of {historyItems.length} analyses
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
