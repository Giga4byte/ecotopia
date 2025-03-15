import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, MapPin, Calendar, Plus, Trash2, Leaf, Navigation, Car, Train, Bus, Plane, Wallet, PiggyBank } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Carbon footprint constants (in kg CO2 per km)
const CARBON_FOOTPRINT = {
  car: 0.2,    // Average car
  train: 0.04, // Electric train
  bus: 0.08,   // Intercity bus
  plane: 0.2   // Domestic flight
};

// Sample data for state capitals with coordinates
const stateCapitals = [
  // States
  { id: 1, name: 'Hyderabad', state: 'Andhra Pradesh', coordinates: { lat: 17.3850, lng: 78.4867 } },
  { id: 2, name: 'Itanagar', state: 'Arunachal Pradesh', coordinates: { lat: 27.0844, lng: 93.6053 } },
  { id: 3, name: 'Dispur', state: 'Assam', coordinates: { lat: 26.1433, lng: 91.7898 } },
  { id: 4, name: 'Patna', state: 'Bihar', coordinates: { lat: 25.5941, lng: 85.1376 } },
  { id: 5, name: 'Raipur', state: 'Chhattisgarh', coordinates: { lat: 21.2514, lng: 81.6296 } },
  { id: 6, name: 'Panaji', state: 'Goa', coordinates: { lat: 15.4989, lng: 73.8278 } },
  { id: 7, name: 'Gandhinagar', state: 'Gujarat', coordinates: { lat: 23.2173, lng: 72.6810 } },
  { id: 8, name: 'Chandigarh', state: 'Haryana', coordinates: { lat: 30.7333, lng: 76.7794 } },
  { id: 9, name: 'Shimla', state: 'Himachal Pradesh', coordinates: { lat: 31.1048, lng: 77.1734 } },
  { id: 10, name: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3441, lng: 85.3096 } },
  { id: 11, name: 'Bengaluru', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } },
  { id: 12, name: 'Thiruvananthapuram', state: 'Kerala', coordinates: { lat: 8.5241, lng: 76.9366 } },
  { id: 13, name: 'Bhopal', state: 'Madhya Pradesh', coordinates: { lat: 23.2599, lng: 77.4126 } },
  { id: 14, name: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0760, lng: 72.8777 } },
  { id: 15, name: 'Imphal', state: 'Manipur', coordinates: { lat: 24.8170, lng: 93.9368 } },
  { id: 16, name: 'Shillong', state: 'Meghalaya', coordinates: { lat: 25.5788, lng: 91.8933 } },
  { id: 17, name: 'Aizawl', state: 'Mizoram', coordinates: { lat: 23.7271, lng: 92.7176 } },
  { id: 18, name: 'Kohima', state: 'Nagaland', coordinates: { lat: 25.6751, lng: 94.1080 } },
  { id: 19, name: 'Bhubaneswar', state: 'Odisha', coordinates: { lat: 20.2961, lng: 85.8245 } },
  { id: 20, name: 'Chandigarh', state: 'Punjab', coordinates: { lat: 30.7333, lng: 76.7794 } },
  { id: 21, name: 'Jaipur', state: 'Rajasthan', coordinates: { lat: 26.9124, lng: 75.7873 } },
  { id: 22, name: 'Gangtok', state: 'Sikkim', coordinates: { lat: 27.3314, lng: 88.6138 } },
  { id: 23, name: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 } },
  { id: 24, name: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.3850, lng: 78.4867 } },
  { id: 25, name: 'Agartala', state: 'Tripura', coordinates: { lat: 23.8315, lng: 91.2868 } },
  { id: 26, name: 'Lucknow', state: 'Uttar Pradesh', coordinates: { lat: 26.8467, lng: 80.9462 } },
  { id: 27, name: 'Dehradun', state: 'Uttarakhand', coordinates: { lat: 30.3165, lng: 78.0322 } },
  { id: 28, name: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } },
  { id: 29, name: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3441, lng: 85.3096 } },
  
  // Union Territories
  { id: 30, name: 'Port Blair', state: 'Andaman and Nicobar Islands', coordinates: { lat: 11.6234, lng: 92.7265 } },
  { id: 31, name: 'Chandigarh', state: 'Chandigarh', coordinates: { lat: 30.7333, lng: 76.7794 } },
  { id: 32, name: 'Silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu', coordinates: { lat: 20.2734, lng: 72.9927 } },
  { id: 33, name: 'Delhi', state: 'Delhi', coordinates: { lat: 28.6139, lng: 77.2090 } },
  { id: 34, name: 'Kavaratti', state: 'Lakshadweep', coordinates: { lat: 10.5626, lng: 72.6369 } },
  { id: 35, name: 'Leh', state: 'Ladakh', coordinates: { lat: 34.1526, lng: 77.5771 } },
  { id: 36, name: 'Srinagar', state: 'Jammu and Kashmir', coordinates: { lat: 34.0837, lng: 74.7973 } }
];

// Sample data for destinations with coordinates
const sampleDestinations = [
  {
    id: 1,
    name: 'Dune Eco Village & Spa',
    location: 'Puducherry, Tamil Nadu',
    description: 'Award-winning eco-resort with sustainable architecture, organic farming, and zero-waste initiatives.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
    ecoRating: 9.5,
    features: ['Solar Powered', 'Organic Farm', 'Waste Management', 'Eco-friendly Architecture'],
    priceRange: '$$$',
    coordinates: { lat: 11.9416, lng: 79.8083 },
    carbonFootprint: {
      accommodation: 20,
      activities: 10,
    }
  },
  {
    id: 2,
    name: 'Spiti Ecosphere',
    location: 'Spiti Valley, Himachal Pradesh',
    description: 'Community-driven sustainable tourism initiative promoting responsible travel and local culture.',
    image: 'https://images.unsplash.com/photo-1626628241075-3a98135684da',
    ecoRating: 9.2,
    features: ['Carbon Neutral', 'Local Community Support', 'Solar Water Heating', 'Organic Farming'],
    priceRange: '$$',
    coordinates: { lat: 31.1048, lng: 77.5696 },
    carbonFootprint: {
      accommodation: 15,
      activities: 5,
    }
  },
  {
    id: 3,
    name: 'Bamboo House India',
    location: 'Vishakhapatnam, Andhra Pradesh',
    description: 'Innovative eco-resort built entirely from bamboo, promoting sustainable architecture and local crafts.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
    ecoRating: 8.8,
    features: ['Bamboo Architecture', 'Rainwater Harvesting', 'Local Artisans', 'Zero Plastic'],
    priceRange: '$$',
    coordinates: { lat: 16.5062, lng: 80.6480 },
    carbonFootprint: {
      accommodation: 10,
      activities: 3,
    }
  },
  {
    id: 4,
    name: 'The Blue Mountains Resort',
    location: 'Ooty, Tamil Nadu',
    description: 'Heritage property with modern sustainability practices, organic gardens, and eco-friendly amenities.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
    ecoRating: 8.5,
    features: ['Heritage Conservation', 'Organic Gardens', 'Energy Efficiency', 'Waste Recycling'],
    priceRange: '$$$',
    coordinates: { lat: 11.4035, lng: 76.7070 },
    carbonFootprint: {
      accommodation: 25,
      activities: 12,
    }
  },
  {
    id: 5,
    name: 'Eco Camp Kerala',
    location: 'Wayanad, Kerala',
    description: 'Sustainable camping experience in the Western Ghats with minimal environmental impact.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
    ecoRating: 9.0,
    features: ['Eco-friendly Camping', 'Local Food', 'Nature Conservation', 'Community Tourism'],
    priceRange: '$$',
    coordinates: { lat: 11.6667, lng: 75.8833 },
    carbonFootprint: {
      accommodation: 10,
      activities: 5,
    }
  },
  {
    id: 6,
    name: 'Sundarbans Eco Resort',
    location: 'Sundarbans, West Bengal',
    description: 'Eco-friendly resort in the world\'s largest mangrove forest, focusing on wildlife conservation.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
    ecoRating: 8.7,
    features: ['Mangrove Conservation', 'Solar Energy', 'Local Community', 'Wildlife Protection'],
    priceRange: '$$',
    coordinates: { lat: 21.9497, lng: 88.9401 },
    carbonFootprint: {
      accommodation: 12,
      activities: 4,
    }
  },
  {
    id: 7,
    name: 'Ranthambore Eco Lodge',
    location: 'Ranthambore, Rajasthan',
    description: 'Sustainable wildlife lodge near Ranthambore National Park with focus on tiger conservation.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
    ecoRating: 8.9,
    features: ['Wildlife Conservation', 'Solar Power', 'Water Recycling', 'Local Employment'],
    priceRange: '$$$',
    coordinates: { lat: 26.0195, lng: 76.4544 },
    carbonFootprint: {
      accommodation: 18,
      activities: 8,
    }
  },
  {
    id: 8,
    name: 'Himalayan Eco Retreat',
    location: 'Manali, Himachal Pradesh',
    description: 'Sustainable mountain retreat with organic farming and traditional architecture.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
    ecoRating: 8.6,
    features: ['Mountain Architecture', 'Organic Farming', 'Solar Heating', 'Waste Management'],
    priceRange: '$$',
    coordinates: { lat: 32.2432, lng: 77.1892 },
    carbonFootprint: {
      accommodation: 15,
      activities: 6,
    }
  }
];

interface City {
  id: number;
  name: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Destination {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  ecoRating: number;
  features: string[];
  priceRange: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  carbonFootprint: {
    accommodation: number; // kg CO2 per night
    activities: number;   // kg CO2 per day
  };
}

interface ItineraryItem {
  id: number;
  destinationId: number;
  date: string;
  notes: string;
  transportMode: 'car' | 'train' | 'bus' | 'plane';
  nights: number;
  days: number;
}

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Calculate carbon footprint for a journey
const calculateJourneyCarbon = (
  distance: number,
  transportMode: 'car' | 'train' | 'bus' | 'plane',
  passengers: number = 1
): number => {
  return (distance * CARBON_FOOTPRINT[transportMode]) / passengers;
};

const CitySelector = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select a capital city</option>
        {stateCapitals.map(city => (
          <option key={city.id} value={`${city.name}, ${city.state}`}>
            {city.name}, {city.state}
          </option>
        ))}
      </select>
    </div>
  );
};

const DestinationCard = ({ 
  destination, 
  onAddToItinerary,
  sourceCity
}: { 
  destination: Destination; 
  onAddToItinerary: (destination: Destination) => void;
  sourceCity: string;
}) => {
  const source = stateCapitals.find(city => `${city.name}, ${city.state}` === sourceCity);
  
  let distance = 0;
  if (source) {
    distance = calculateDistance(
      source.coordinates.lat,
      source.coordinates.lng,
      destination.coordinates.lat,
      destination.coordinates.lng
    );
  }

  // Calculate sustainable transport options based on distance
  const getSustainableTransportOptions = (distance: number) => {
    const options = [];
    if (distance < 300) {
      options.push({ mode: 'train', carbon: calculateJourneyCarbon(distance, 'train') });
      options.push({ mode: 'bus', carbon: calculateJourneyCarbon(distance, 'bus') });
    }
    if (distance < 100) {
      options.push({ mode: 'car', carbon: calculateJourneyCarbon(distance, 'car') });
    }
    if (distance > 500) {
      options.push({ mode: 'plane', carbon: calculateJourneyCarbon(distance, 'plane') });
    }
    return options.sort((a, b) => a.carbon - b.carbon);
  };

  const transportOptions = getSustainableTransportOptions(distance);

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
        {distance > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            <p>Distance: {Math.round(distance)} km</p>
            <div className="mt-2">
              <p className="font-medium text-green-700">Sustainable Transport Options:</p>
              <ul className="mt-1 space-y-1">
                {transportOptions.map((option, index) => (
                  <li key={index} className="flex items-center">
                    {option.mode === 'train' && <Train size={14} className="mr-1" />}
                    {option.mode === 'bus' && <Bus size={14} className="mr-1" />}
                    {option.mode === 'car' && <Car size={14} className="mr-1" />}
                    {option.mode === 'plane' && <Plane size={14} className="mr-1" />}
                    {option.mode.charAt(0).toUpperCase() + option.mode.slice(1)}: {Math.round(option.carbon)} kg CO2
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-2">Accommodation footprint: {Math.round(destination.carbonFootprint.accommodation)} kg CO2/night</p>
          </div>
        )}
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

// Price multipliers for non-eco options
const NON_ECO_MULTIPLIERS = {
  accommodation: 1.3,  // Non-eco accommodation costs 30% more
  transport: 1.2,     // Non-eco transport costs 20% more
  activities: 1.25    // Non-eco activities cost 25% more
};

interface BudgetInfo {
  totalBudget: number;
  spentAmount: number;
}

const BudgetAnalysis = ({ 
  itinerary, 
  destinations, 
  sourceCity,
  budgetInfo,
  onBudgetUpdate
}: { 
  itinerary: ItineraryItem[];
  destinations: Destination[];
  sourceCity: string;
  budgetInfo: BudgetInfo;
  onBudgetUpdate: (field: keyof BudgetInfo, value: string) => void;
}) => {
  const calculateCosts = () => {
    let ecoTotal = 0;
    let nonEcoTotal = 0;

    itinerary.forEach(item => {
      const destination = destinations.find(d => d.id === item.destinationId);
      if (!destination) return;

      // Calculate accommodation costs
      const ecoAccommodation = destination.priceRange === '$$$' ? 5000 : 
                              destination.priceRange === '$$' ? 3000 : 2000;
      const nonEcoAccommodation = ecoAccommodation * NON_ECO_MULTIPLIERS.accommodation;
      
      // Calculate transport costs
      const source = stateCapitals.find(city => `${city.name}, ${city.state}` === sourceCity);
      let transportCost = 0;
      if (source) {
        const distance = calculateDistance(
          source.coordinates.lat,
          source.coordinates.lng,
          destination.coordinates.lat,
          destination.coordinates.lng
        );
        
        // Base transport costs per km
        const transportRates = {
          car: 12,
          train: 2,
          bus: 1.5,
          plane: 8
        };
        
        transportCost = distance * transportRates[item.transportMode];
      }
      const nonEcoTransport = transportCost * NON_ECO_MULTIPLIERS.transport;

      // Calculate activity costs
      const ecoActivities = 1000 * item.days;
      const nonEcoActivities = ecoActivities * NON_ECO_MULTIPLIERS.activities;

      ecoTotal += (ecoAccommodation * item.nights) + transportCost + ecoActivities;
      nonEcoTotal += (nonEcoAccommodation * item.nights) + nonEcoTransport + nonEcoActivities;
    });

    return { ecoTotal, nonEcoTotal };
  };

  const { ecoTotal, nonEcoTotal } = calculateCosts();
  const savings = nonEcoTotal - ecoTotal;
  const ecoSavingsPercentage = ((savings / nonEcoTotal) * 100).toFixed(1);

  const chartData = {
    labels: ['Eco-Friendly', 'Traditional'],
    datasets: [
      {
        label: 'Total Cost (₹)',
        data: [ecoTotal, nonEcoTotal],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cost Comparison: Eco vs Traditional Travel',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cost (₹)',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Track your eco-friendly travel savings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Total Budget</h3>
              <div className="mt-2">
                <Input
                  type="number"
                  value={budgetInfo.totalBudget}
                  onChange={(e) => onBudgetUpdate('totalBudget', e.target.value)}
                  placeholder="Enter your budget"
                  className="text-2xl font-bold text-green-700"
                />
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Amount Spent</h3>
              <div className="mt-2">
                <Input
                  type="number"
                  value={budgetInfo.spentAmount}
                  onChange={(e) => onBudgetUpdate('spentAmount', e.target.value)}
                  placeholder="Enter amount spent"
                  className="text-2xl font-bold text-blue-700"
                />
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Remaining Budget</h3>
              <p className="text-2xl font-bold text-yellow-700">
                ₹{(budgetInfo.totalBudget - budgetInfo.spentAmount).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-6 bg-green-100 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Eco-Friendly Cost</h3>
              <p className="text-3xl font-bold text-green-700">₹{ecoTotal.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-red-100 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Traditional Cost</h3>
              <p className="text-3xl font-bold text-red-700">₹{nonEcoTotal.toLocaleString()}</p>
            </div>
          </div>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800">Your Eco-Savings</CardTitle>
              <CardDescription className="text-emerald-600">
                Amount saved by choosing eco-friendly options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-emerald-700">₹{savings.toLocaleString()}</p>
                  <p className="text-sm text-emerald-600 mt-1">
                    You're saving {ecoSavingsPercentage}% on your travel expenses!
                  </p>
                </div>
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <PiggyBank className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
            <div className="h-80">
              <Bar options={chartOptions} data={chartData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ItineraryPlanner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations] = useState<Destination[]>(sampleDestinations);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [activeTab, setActiveTab] = useState('plan');
  const [sourceCity, setSourceCity] = useState('');
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo>({
    totalBudget: 0,
    spentAmount: 0
  });
  
  // Filter destinations based on distance from source city
  const getFilteredDestinations = () => {
    if (!sourceCity) return destinations;
    
    const source = stateCapitals.find(city => `${city.name}, ${city.state}` === sourceCity);
    if (!source) return destinations;

    return destinations
      .map(dest => ({
        ...dest,
        distance: calculateDistance(
          source.coordinates.lat,
          source.coordinates.lng,
          dest.coordinates.lat,
          dest.coordinates.lng
        )
      }))
      .filter(dest => dest.distance <= 1000) // Show destinations within 1000km
      .sort((a, b) => {
        // Sort by eco rating first, then by distance
        if (b.ecoRating !== a.ecoRating) {
          return b.ecoRating - a.ecoRating;
        }
        return a.distance - b.distance;
      });
  };

  const filteredDestinations = getFilteredDestinations().filter(destination => 
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
      transportMode: 'car',
      nights: 1,
      days: 1
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

  const handleUpdateTransportMode = (itemId: number, mode: 'car' | 'train' | 'bus' | 'plane') => {
    setItinerary(itinerary.map(item => 
      item.id === itemId ? { ...item, transportMode: mode } : item
    ));
  };

  const handleUpdateDuration = (itemId: number, nights: number, days: number) => {
    setItinerary(itinerary.map(item => 
      item.id === itemId ? { ...item, nights, days } : item
    ));
  };

  const calculateTotalCarbonFootprint = () => {
    return itinerary.reduce((total, item) => {
      const destination = getDestinationById(item.destinationId);
      if (!destination) return total;

      const source = stateCapitals.find(city => `${city.name}, ${city.state}` === sourceCity);
      
      let journeyCarbon = 0;
      if (source) {
        const distance = calculateDistance(
          source.coordinates.lat,
          source.coordinates.lng,
          destination.coordinates.lat,
          destination.coordinates.lng
        );
        journeyCarbon = calculateJourneyCarbon(distance, item.transportMode);
      }

      const accommodationCarbon = destination.carbonFootprint.accommodation * item.nights;
      const activitiesCarbon = destination.carbonFootprint.activities * item.days;

      return total + journeyCarbon + accommodationCarbon + activitiesCarbon;
    }, 0);
  };

  const handleBudgetUpdate = (field: keyof BudgetInfo, value: string) => {
    setBudgetInfo(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  return (
    <div>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="plan">Plan Your Route</TabsTrigger>
          <TabsTrigger value="destinations">Sustainable Destinations</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plan">
          <Card className="p-6 mb-6">
            <CardHeader>
              <CardTitle>Plan Your Sustainable Journey</CardTitle>
              <CardDescription>Select your capital city to find sustainable destinations within reach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto">
                <CitySelector
                  label="Select Your Capital City"
                  value={sourceCity}
                  onChange={setSourceCity}
                />
                {sourceCity && (
                  <div className="mt-6">
                    <Button 
                      className="w-full bg-ecotopia-primary hover:bg-ecotopia-light"
                      onClick={() => setActiveTab('destinations')}
                    >
                      <Navigation className="mr-2" size={16} />
                      Find Sustainable Destinations
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
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
                sourceCity={sourceCity}
              />
            ))}
          </div>
          
          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No destinations found. Try a different search term.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="budget">
          <Card className="p-6 mb-6">
            <CardHeader>
              <CardTitle>Set Your Budget</CardTitle>
              <CardDescription>Enter your total budget and spent amount to track eco-savings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Budget (₹)</label>
                  <Input
                    type="number"
                    value={budgetInfo.totalBudget}
                    onChange={(e) => handleBudgetUpdate('totalBudget', e.target.value)}
                    placeholder="Enter your budget"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount Spent (₹)</label>
                  <Input
                    type="number"
                    value={budgetInfo.spentAmount}
                    onChange={(e) => handleBudgetUpdate('spentAmount', e.target.value)}
                    placeholder="Enter amount spent"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {itinerary.length > 0 ? (
            <BudgetAnalysis
              itinerary={itinerary}
              destinations={destinations}
              sourceCity={sourceCity}
              budgetInfo={budgetInfo}
              onBudgetUpdate={handleBudgetUpdate}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Add destinations to your itinerary to see cost comparisons!</p>
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
