
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface NutritionChartProps {
  nutrition: NutritionData;
}

const NutritionChart = ({ nutrition }: NutritionChartProps) => {
  const macroData = [
    { name: 'Carbs', value: nutrition.carbs, color: '#f97316' },
    { name: 'Protein', value: nutrition.protein, color: '#ef4444' },
    { name: 'Fat', value: nutrition.fat, color: '#eab308' }
  ];

  const detailedData = [
    { name: 'Calories', value: nutrition.calories, unit: 'kcal' },
    { name: 'Carbs', value: nutrition.carbs, unit: 'g' },
    { name: 'Protein', value: nutrition.protein, unit: 'g' },
    { name: 'Fat', value: nutrition.fat, unit: 'g' },
    { name: 'Fiber', value: nutrition.fiber || 0, unit: 'g' },
    { name: 'Sugar', value: nutrition.sugar || 0, unit: 'g' },
    { name: 'Sodium', value: nutrition.sodium || 0, unit: 'mg' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Macronutrients Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Macronutrients Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}g`}
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}g`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Nutrition Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={detailedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} ${props.payload.unit}`, 
                  name
                ]} 
              />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionChart;
