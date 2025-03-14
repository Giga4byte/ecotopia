
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, MapPin, Calendar, Plus, Trash2, Leaf } from 'lucide-react';

// Sample data for destinations
const sampleDestinations = [
  {
    id: 1,
    name: 'Costa Rica Eco Lodge',
    location: 'Monteverde, Costa Rica',
    description: 'Sustainable lodge in the cloud forest with renewable energy and conservation programs.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    ecoRating: 9.5,
    features: ['Solar Powered', 'Rainwater Harvesting', 'Farm-to-Table Dining'],
    priceRange: '$$$'
  },
  {
    id: 2,
    name: 'Tasmania Wilderness Retreat',
    location: 'Cradle Mountain, Tasmania',
    description: 'Off-grid cabins with minimal environmental impact in pristine wilderness.',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    ecoRating: 8.8,
    features: ['Carbon Neutral', 'Wildlife Conservation', 'Organic Gardens'],
    priceRange: '$$'
  },
  {
    id: 3,
    name: 'Norwegian Fjord Eco-Camp',
    location: 'Geirangerfjord, Norway',
    description: 'Sustainable glamping experience with spectacular fjord views and zero-waste policy.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
    ecoRating: 9.2,
    features: ['Zero Waste', 'Local Guides', 'Renewable Energy'],
    priceRange: '$$'
  }
];

interface Destination {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  ecoRating: number;
  features: string[];
  priceRange: string;
}

interface ItineraryItem {
  id: number;
  destinationId: number;
  date: string;
  notes: string;
}

const DestinationCard = ({ 
  destination, 
  onAddToItinerary 
}: { 
  destination: Destination; 
  onAddToItinerary: (destination: Destination) => void;
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-ecotopia-primary text-white px-2 py-1 rounded-md text-sm font-medium flex items-center">
          <Leaf size={14} className="mr-1" />
          {destination.ecoRating}/10
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{destination.name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin size={14} className="mr-1" /> {destination.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-3">{destination.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {destination.features.map((feature, index) => (
            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">Price range: {destination.priceRange}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onAddToItinerary(destination)} 
          className="w-full bg-ecotopia-primary hover:bg-ecotopia-light"
        >
          <Plus size={16} className="mr-2" /> Add to Itinerary
        </Button>
      </CardFooter>
    </Card>
  );
};

const ItineraryPlanner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations] = useState<Destination[]>(sampleDestinations);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [activeTab, setActiveTab] = useState('destinations');
  
  const filteredDestinations = destinations.filter(destination => 
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddToItinerary = (destination: Destination) => {
    const today = new Date();
    const newItem: ItineraryItem = {
      id: Date.now(),
      destinationId: destination.id,
      date: today.toISOString().split('T')[0],
      notes: '',
    };
    
    setItinerary([...itinerary, newItem]);
    setActiveTab('itinerary');
  };
  
  const handleRemoveFromItinerary = (itemId: number) => {
    setItinerary(itinerary.filter(item => item.id !== itemId));
  };
  
  const getDestinationById = (id: number) => {
    return destinations.find(destination => destination.id === id);
  };
  
  const handleUpdateDate = (itemId: number, newDate: string) => {
    setItinerary(itinerary.map(item => 
      item.id === itemId ? { ...item, date: newDate } : item
    ));
  };
  
  const handleUpdateNotes = (itemId: number, newNotes: string) => {
    setItinerary(itinerary.map(item => 
      item.id === itemId ? { ...item, notes: newNotes } : item
    ));
  };
  
  return (
    <div>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="destinations">Sustainable Destinations</TabsTrigger>
          <TabsTrigger value="itinerary">My Itinerary ({itinerary.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="destinations">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search for eco-friendly destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map(destination => (
              <DestinationCard 
                key={destination.id} 
                destination={destination} 
                onAddToItinerary={handleAddToItinerary}
              />
            ))}
          </div>
          
          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No destinations found. Try a different search term.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="itinerary">
          {itinerary.length > 0 ? (
            <div className="space-y-4">
              {itinerary
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(item => {
                  const destination = getDestinationById(item.destinationId);
                  
                  if (!destination) return null;
                  
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-40 md:h-auto">
                          <img 
                            src={destination.image} 
                            alt={destination.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-semibold">{destination.name}</h3>
                              <p className="text-gray-600 flex items-center">
                                <MapPin size={14} className="mr-1" /> {destination.location}
                              </p>
                            </div>
                            <Button 
                              onClick={() => handleRemoveFromItinerary(item.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          
                          <div className="mb-3 flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-500" />
                            <Input 
                              type="date" 
                              value={item.date} 
                              onChange={(e) => handleUpdateDate(item.id, e.target.value)}
                              className="w-44 h-8 text-sm"
                            />
                          </div>
                          
                          <Input
                            placeholder="Add notes for this destination..."
                            value={item.notes}
                            onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                            className="mb-2"
                          />
                          
                          <div className="flex flex-wrap gap-2">
                            {destination.features.map((feature, index) => (
                              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              
              <div className="flex justify-end mt-6">
                <Button className="bg-ecotopia-primary hover:bg-ecotopia-light">
                  Save Itinerary
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your itinerary is empty. Add some eco-friendly destinations!</p>
              <Button 
                onClick={() => setActiveTab('destinations')}
                className="bg-ecotopia-primary hover:bg-ecotopia-light"
              >
                Browse Destinations
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItineraryPlanner;
