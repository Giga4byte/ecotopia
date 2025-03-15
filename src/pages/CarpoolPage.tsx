import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarpoolMap from '@/components/CarpoolMap';
import RideSearchForm from '@/components/RideSearchForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Users, Leaf, Globe } from 'lucide-react';
import { useState } from 'react';
import { type Location, type MatchedRide } from '@/services/carpoolService';

const CarpoolPage = () => {
  const [activeTab, setActiveTab] = useState<'find' | 'offer'>('find');
  const [startLocation, setStartLocation] = useState<Location>();
  const [endLocation, setEndLocation] = useState<Location>();
  const [matches, setMatches] = useState<MatchedRide[]>([]);

  const handleLocationsChange = (start?: Location, end?: Location, newMatches?: MatchedRide[]) => {
    setStartLocation(start);
    setEndLocation(end);
    setMatches(newMatches || []);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-ecotopia-primary text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Eco-Friendly Carpooling</h1>
            <p className="max-w-3xl opacity-90">
              Connect with fellow eco-conscious travelers to share rides, reduce emissions, 
              and make your journey more sustainable and affordable.
            </p>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Car className="h-10 w-10 text-ecotopia-primary mb-2" />
                  <h3 className="text-2xl font-bold">15,240</h3>
                  <p className="text-gray-600">Shared Rides</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Users className="h-10 w-10 text-ecotopia-primary mb-2" />
                  <h3 className="text-2xl font-bold">28,500</h3>
                  <p className="text-gray-600">Active Users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Leaf className="h-10 w-10 text-ecotopia-primary mb-2" />
                  <h3 className="text-2xl font-bold">320</h3>
                  <p className="text-gray-600">Tons CO₂ Saved</p>
                </CardContent>
              </Card> 
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Globe className="h-10 w-10 text-ecotopia-primary mb-2" />
                  <h3 className="text-2xl font-bold">120</h3>
                  <p className="text-gray-600">Destinations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Find or Offer a Ride</h2>
            <div className="flex gap-4 mb-6">
              <Button
                className={`${
                  activeTab === 'find'
                    ? 'bg-ecotopia-primary text-white'
                    : 'bg-white text-ecotopia-primary border-ecotopia-primary'
                } border`}
                onClick={() => setActiveTab('find')}
              >
                Find a Ride
              </Button>
              <Button
                className={`${
                  activeTab === 'offer'
                    ? 'bg-ecotopia-primary text-white'
                    : 'bg-white text-ecotopia-primary border-ecotopia-primary'
                } border`}
                onClick={() => setActiveTab('offer')}
              >
                Offer a Ride
              </Button>
            </div>
            
            <RideSearchForm 
              type={activeTab}
              onLocationsChange={handleLocationsChange}
            />
          </div>
          
          <CarpoolMap
            startLocation={startLocation}
            endLocation={endLocation}
            matches={matches}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarpoolPage;
