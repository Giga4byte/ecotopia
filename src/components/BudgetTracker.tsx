import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { Leaf, DollarSign, AlertTriangle, Plus, Calendar, CreditCard, Trash2, Edit2 } from 'lucide-react';

const CATEGORIES = [
  'Accommodation',
  'Transportation',
  'Food & Dining',
  'Activities & Entertainment',
  'Shopping',
  'Miscellaneous'
] as const;

type Category = typeof CATEGORIES[number];
type EcoRating = 1 | 2 | 3 | 4 | 5;

const PAYMENT_METHODS = ['Cash', 'Card', 'UPI'] as const;

const ECO_RATINGS = [
  { value: 5, label: 'Excellent - Minimal Impact' },
  { value: 4, label: 'Good - Low Impact' },
  { value: 3, label: 'Average Impact' },
  { value: 2, label: 'High Impact' },
  { value: 1, label: 'Very High Impact' }
] as const;

const categoryColors = {
  'Accommodation': '#2E7D32',
  'Transportation': '#FF5722',
  'Food & Dining': '#2196F3',
  'Activities & Entertainment': '#9C27B0',
  'Shopping': '#FFC107',
  'Miscellaneous': '#607D8B'
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

const CATEGORY_ECO_RULES: Record<Category, (amount: number) => 1 | 2 | 3 | 4 | 5> = {
  'Transportation': (amount: number) => {
    if (amount < 50) return 5;
    if (amount < 100) return 4;
    if (amount < 200) return 3;
    if (amount < 500) return 2;
    return 1;
  },
  'Accommodation': (amount: number) => {
    if (amount < 50) return 5;
    if (amount < 100) return 4;
    if (amount < 200) return 3;
    if (amount < 400) return 2;
    return 1;
  },
  'Food & Dining': (amount: number) => {
    if (amount < 20) return 5;
    if (amount < 40) return 4;
    if (amount < 80) return 3;
    if (amount < 150) return 2;
    return 1;
  },
  'Activities & Entertainment': (amount: number) => {
    if (amount < 30) return 5;
    if (amount < 60) return 4;
    if (amount < 100) return 3;
    if (amount < 200) return 2;
    return 1;
  },
  'Shopping': (amount: number) => {
    if (amount < 50) return 5;
    if (amount < 100) return 4;
    if (amount < 200) return 3;
    if (amount < 500) return 2;
    return 1;
  },
  'Miscellaneous': () => 3
};

interface Transaction {
  id: string;
  amount: number;
  category: Category;
  date: string;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  ecoRating: EcoRating;
}

interface CategoryBudget {
  category: Category;
  limit: number;
  spent: number;
}

interface FormData {
  amount: number;
  category: Category;
  date: string;
  paymentMethod: typeof PAYMENT_METHODS[number];
}

const BudgetTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [totalBudget, setTotalBudget] = useState(5000);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [budgetFormData, setBudgetFormData] = useState({
    totalBudget: 5000,
    categoryBudgets: {} as Record<Category, number>
  });
  
  // Form state with proper typing
  const [formData, setFormData] = useState<FormData>({
    amount: 0,
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash'
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedBudget = localStorage.getItem('totalBudget');
    const savedCategoryBudgets = localStorage.getItem('categoryBudgets');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedBudget) {
      setTotalBudget(JSON.parse(savedBudget));
    }
    if (savedCategoryBudgets) {
      setCategoryBudgets(JSON.parse(savedCategoryBudgets));
    } else {
      // Initialize category budgets if none exist
      setCategoryBudgets(
        CATEGORIES.map(category => ({
          category,
          limit: totalBudget / CATEGORIES.length,
          spent: 0
        }))
      );
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('totalBudget', JSON.stringify(totalBudget));
    localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
  }, [transactions, totalBudget, categoryBudgets]);

  // Calculate totals and update category spending
  useEffect(() => {
    const newCategoryBudgets = [...categoryBudgets];
    
    // Reset spent amounts
    newCategoryBudgets.forEach(budget => {
      budget.spent = 0;
    });

    // Calculate new spent amounts
    transactions.forEach(transaction => {
      const categoryBudget = newCategoryBudgets.find(
        budget => budget.category === transaction.category
      );
      if (categoryBudget) {
        categoryBudget.spent += transaction.amount;
      }
    });

    setCategoryBudgets(newCategoryBudgets);
  }, [transactions]);

  // Calculate eco rating with proper typing
  const calculateEcoRating = (category: Category, amount: number): 1 | 2 | 3 | 4 | 5 => {
    return CATEGORY_ECO_RULES[category](amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    const newTransaction: Transaction = {
      ...formData,
      id: Date.now().toString(),
      ecoRating: calculateEcoRating(formData.category, formData.amount)
    };

    setTransactions([...transactions, newTransaction]);
    setShowAddForm(false);
    
    // Reset form
    setFormData({
      amount: 0,
      category: CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash'
    });
  };

  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const remaining = totalBudget - totalSpent;

  const pieData = Object.entries(
    transactions.reduce((acc: Record<string, number>, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const averageEcoRating = transactions.length > 0
    ? transactions.reduce((sum, t) => sum + t.ecoRating, 0) / transactions.length
    : 0;

  const handleDeleteTransaction = (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.id !== transactionId)
      );
    }
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTotalBudget(budgetFormData.totalBudget);
    
    const newCategoryBudgets = categoryBudgets.map(budget => ({
      ...budget,
      limit: budgetFormData.categoryBudgets[budget.category] || budget.limit
    }));
    
    setCategoryBudgets(newCategoryBudgets);
    setShowBudgetForm(false);
  };

  const handleShowBudgetForm = () => {
    setBudgetFormData({
      totalBudget: totalBudget,
      categoryBudgets: Object.fromEntries(
        categoryBudgets.map(budget => [budget.category, budget.limit])
      ) as Record<Category, number>
    });
    setShowBudgetForm(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Track your spending and eco-impact</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleShowBudgetForm}
                variant="outline"
                className="border-ecotopia-primary text-ecotopia-primary hover:bg-ecotopia-primary hover:text-white"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Budget
              </Button>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-ecotopia-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showBudgetForm && (
            <form onSubmit={handleBudgetSubmit} className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="totalBudget">Total Budget</Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgetFormData.totalBudget}
                    onChange={(e) => setBudgetFormData({
                      ...budgetFormData,
                      totalBudget: parseFloat(e.target.value)
                    })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Category Budgets</Label>
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Label htmlFor={`budget-${category}`} className="w-48">{category}</Label>
                      <Input
                        id={`budget-${category}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={budgetFormData.categoryBudgets[category] || 0}
                        onChange={(e) => setBudgetFormData({
                          ...budgetFormData,
                          categoryBudgets: {
                            ...budgetFormData.categoryBudgets,
                            [category]: parseFloat(e.target.value)
                          }
                        })}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowBudgetForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-ecotopia-primary">
                  Save Budget
                </Button>
              </div>
            </form>
          )}

          {showAddForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md"
                    value={formData.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const value = e.target.value;
                      if (CATEGORIES.includes(value as Category)) {
                        setFormData(prev => ({ ...prev, category: value as Category }));
                      }
                    }}
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    className="w-full p-2 border rounded-md"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    required
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-ecotopia-primary">
                  Save Transaction
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <div className="bg-ecotopia-primary rounded-full w-10 h-10 flex items-center justify-center text-white mr-3">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Spent</p>
                <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center text-white mr-3">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-2xl font-bold text-gray-800">${remaining.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 flex items-center">
              <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-white mr-3">
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Eco Score</p>
                <p className="text-2xl font-bold text-gray-800">
                  {averageEcoRating.toFixed(1)}/5.0
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <h3 className="font-medium mb-4">Category Budgets</h3>
              <div className="space-y-4">
                {categoryBudgets.map((budget) => (
                  <div key={budget.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{budget.category}</span>
                      <span>${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          budget.spent > budget.limit ? 'bg-red-500' : 'bg-ecotopia-primary'
                        }`}
                        style={{
                          width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {transactions.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Payment</th>
                      <th className="text-left py-3 px-4">Eco Rating</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...transactions]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4">{transaction.category}</td>
                          <td className="py-3 px-4">${transaction.amount.toFixed(2)}</td>
                          <td className="py-3 px-4">{transaction.paymentMethod}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {Array.from({ length: transaction.ecoRating }).map((_, i) => (
                                <Leaf
                                  key={i}
                                  size={16}
                                  className="text-ecotopia-primary"
                                />
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetTracker;
