
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { Leaf, DollarSign, AlertTriangle } from 'lucide-react';

// Sample data
const initialExpenses = [
  { id: 1, category: 'Accommodation', amount: 120, ecoRating: 'high', date: '2023-08-01' },
  { id: 2, category: 'Transportation', amount: 75, ecoRating: 'medium', date: '2023-08-01' },
  { id: 3, category: 'Food', amount: 45, ecoRating: 'high', date: '2023-08-01' },
  { id: 4, category: 'Activities', amount: 60, ecoRating: 'low', date: '2023-08-02' },
  { id: 5, category: 'Souvenirs', amount: 30, ecoRating: 'medium', date: '2023-08-03' },
];

const categoryColors = {
  Accommodation: '#2E7D32',
  Transportation: '#FF5722',
  Food: '#2196F3',
  Activities: '#9C27B0',
  Souvenirs: '#FFC107',
};

const EcoRatingBadge = ({ rating }: { rating: string }) => {
  const colors: Record<string, string> = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[rating]}`}>
      {rating === 'high' ? 'Eco-friendly' : rating === 'medium' ? 'Moderate impact' : 'High impact'}
    </span>
  );
};

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showEcoTips, setShowEcoTips] = useState(false);
  
  const totalBudget = 500;
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;
  
  const pieData = Object.entries(
    expenses.reduce((acc: Record<string, number>, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  
  const barData = [
    { name: 'Accommodation', eco: 80, nonEco: 150 },
    { name: 'Transportation', eco: 40, nonEco: 120 },
    { name: 'Food', eco: 30, nonEco: 60 },
    { name: 'Activities', eco: 50, nonEco: 90 },
  ];
  
  const ecoTips = [
    "Choose locally-owned accommodations with green certifications to reduce your environmental impact.",
    "Opt for public transportation or shared rides instead of private vehicles.",
    "Eat at restaurants that source ingredients locally and offer vegetarian options.",
    "Select activities that support environmental conservation and local communities.",
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Budget Overview</span>
            <span className="text-lg font-normal">${totalBudget} total budget</span>
          </CardTitle>
          <CardDescription>Track your spending and eco-impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <div className="bg-ecotopia-primary rounded-full w-10 h-10 flex items-center justify-center text-white mr-3">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Spent</p>
                <p className="text-2xl font-bold text-gray-800">${totalSpent}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center text-white mr-3">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-2xl font-bold text-gray-800">${remaining}</p>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 flex items-center">
              <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-white mr-3">
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Eco-savings</p>
                <p className="text-2xl font-bold text-gray-800">$85</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="font-medium mb-4">Spending by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={categoryColors[entry.name as keyof typeof categoryColors] || '#000000'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Eco vs. Non-Eco Cost Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="eco" name="Eco-friendly" fill="#2E7D32" />
                    <Bar dataKey="nonEco" name="Traditional" fill="#FF5722" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Expenses</span>
            <Button className="bg-ecotopia-primary hover:bg-ecotopia-light">Add Expense</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Eco Rating</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{expense.category}</td>
                    <td className="py-3 px-4">{expense.date}</td>
                    <td className="py-3 px-4">${expense.amount}</td>
                    <td className="py-3 px-4">
                      <EcoRatingBadge rating={expense.ecoRating} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Eco-Saving Suggestions</CardTitle>
            <CardDescription>Tips to save money while reducing environmental impact</CardDescription>
          </div>
          <Button 
            onClick={() => setShowEcoTips(!showEcoTips)}
            variant="outline"
            className="border-ecotopia-primary text-ecotopia-primary"
          >
            {showEcoTips ? 'Hide Tips' : 'Show Tips'}
          </Button>
        </CardHeader>
        
        {showEcoTips && (
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center mb-3">
                <Leaf className="text-ecotopia-primary mr-2" size={20} />
                <h3 className="font-medium text-ecotopia-primary">Eco-Friendly Travel Tips</h3>
              </div>
              <ul className="space-y-3">
                {ecoTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-ecotopia-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{tip}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start">
                <AlertTriangle className="text-yellow-600 mr-2 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-yellow-800">
                  Your transportation expenses show a high carbon footprint. Consider using public transportation or shared rides to reduce emissions and save up to 40%.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default BudgetTracker;
