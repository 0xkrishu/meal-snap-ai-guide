
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  created_at: string;
  food_name: string;
  is_healthy: boolean;
  calories: number;
  image_url: string;
  health_tip: string;
  health_reason: string;
}

const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('food_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        toast({
          title: "Error loading history",
          description: "Failed to load your analysis history.",
          variant: "destructive",
        });
      } else {
        setHistoryItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error loading history",
        description: "Failed to load your analysis history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

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
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.location.href = '/dashboard'}
                >
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
                        src={item.image_url} 
                        alt={item.food_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.food_name}</h3>
                        <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant={item.is_healthy ? "default" : "destructive"} className="text-sm">
                          {item.is_healthy ? "Healthy" : "Not Healthy"}
                        </Badge>
                        <span className="text-sm text-gray-600">{item.calories} calories</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{item.health_reason}</p>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => {
                            toast({
                              title: "Health Tip",
                              description: item.health_tip,
                            });
                          }}
                        >
                          View Health Tip
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-gray-600 hover:bg-gray-50"
                          onClick={() => window.location.href = '/dashboard'}
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
              Showing {historyItems.length} analysis{historyItems.length !== 1 ? 'es' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
