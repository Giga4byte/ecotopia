
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ItineraryPlanner from '@/components/ItineraryPlanner';
import BudgetTracker from '@/components/BudgetTracker';
import { MapPin, DollarSign } from 'lucide-react';

const ItineraryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-ecotopia-primary text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sustainable Itinerary Planner</h1>
            <p className="max-w-3xl opacity-90">
              Plan your eco-friendly adventure and track your budget. Discover sustainable destinations, 
              monitor your expenses, and get suggestions to reduce your environmental impact.
            </p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="planner" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="planner" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Itinerary
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Budget
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="planner" className="space-y-4">
              <ItineraryPlanner />
            </TabsContent>
            
            <TabsContent value="budget" className="space-y-4">
              <BudgetTracker />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItineraryPage;
