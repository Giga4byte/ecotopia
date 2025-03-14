
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Car, Calendar, User, MapPin, Clock } from 'lucide-react';

// Sample data for available rides
const sampleRides = [
  {
    id: 1,
    driver: {
      name: 'Alex Thompson',
      rating: 4.8,
      rides: 26,
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    from: 'San Francisco, CA',
    to: 'Yosemite National Park, CA',
    date: '2023-08-15',
    time: '08:00 AM',
    seats: 3,
    price: 25,
    ecoImpact: 'low',
    carType: 'Electric',
    description: 'Heading to Yosemite for a weekend camping trip. Looking for fellow nature enthusiasts to share the ride and reduce emissions.'
  },
  {
    id: 2,
    driver: {
      name: 'Maya Rodriguez',
      rating: 4.9,
      rides: 42,
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    from: 'Portland, OR',
    to: 'Cannon Beach, OR',
    date: '2023-08-12',
    time: '09:30 AM',
    seats: 2,
    price: 18,
    ecoImpact: 'medium',
    carType: 'Hybrid',
    description: 'Day trip to Cannon Beach. I know some great spots for wildlife viewing along the way if you\'re interested.'
  },
  {
    id: 3,
    driver: {
      name: 'David Chen',
      rating: 4.7,
      rides: 15,
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    from: 'Seattle, WA',
    to: 'Olympic National Park, WA',
    date: '2023-08-20',
    time: '07:15 AM',
    seats: 4,
    price: 22,
    ecoImpact: 'low',
    carType: 'Electric',
    description: 'Exploring Olympic National Park for the day. Planning to do some hiking and photography. Would love eco-conscious companions!'
  }
];

const ecoImpactColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const CarpoolMap = () => {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [availableRides, setAvailableRides] = useState(sampleRides);
  
  const filteredRides = availableRides.filter(ride => {
    const matchFrom = searchFrom === '' || ride.from.toLowerCase().includes(searchFrom.toLowerCase());
    const matchTo = searchTo === '' || ride.to.toLowerCase().includes(searchTo.toLowerCase());
    const matchDate = searchDate === '' || ride.date === searchDate;
    
    return matchFrom && matchTo && matchDate;
  });
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Search Panel */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Find a Shared Ride</CardTitle>
          <CardDescription>Search for eco-friendly rides to your destination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <Input 
              placeholder="Departure location" 
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <Input 
              placeholder="Destination" 
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <Input 
              type="date" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <Button className="w-full bg-ecotopia-primary hover:bg-ecotopia-light">
            Search Rides
          </Button>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full border-ecotopia-primary text-ecotopia-primary">
              Offer a Ride
            </Button>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium mb-2">Why carpool?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="bg-ecotopia-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <p>Reduce your carbon footprint by sharing rides</p>
              </li>
              <li className="flex items-start">
                <span className="bg-ecotopia-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <p>Save money on gas and parking</p>
              </li>
              <li className="flex items-start">
                <span className="bg-ecotopia-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <p>Meet like-minded eco-conscious travelers</p>
              </li>
              <li className="flex items-start">
                <span className="bg-ecotopia-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                <p>Reduce traffic congestion in nature spots</p>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Map and Ride List */}
      <div className="lg:col-span-2 space-y-6">
        {/* Placeholder for map */}
        <Card>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Interactive map view will be shown here</p>
          </div>
        </Card>
        
        {/* Available rides */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Rides ({filteredRides.length})</h2>
          
          {filteredRides.length > 0 ? (
            filteredRides.map(ride => (
              <Card key={ride.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 md:w-4/6">
                    <div className="flex items-start gap-3 mb-3">
                      <img 
                        src={ride.driver.avatar} 
                        alt={ride.driver.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{ride.driver.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="flex items-center">
                            ★ {ride.driver.rating}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{ride.driver.rides} rides</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center mb-2">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium">{ride.from}</p>
                          <div className="flex items-center text-gray-500">
                            <ArrowRight size={12} className="mx-1" />
                            <p className="font-medium">{ride.to}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar size={14} className="mr-1" />
                        <span>{ride.date}</span>
                        <span className="mx-2">•</span>
                        <Clock size={14} className="mr-1" />
                        <span>{ride.time}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{ride.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center">
                        <Car size={14} className="mr-1" />
                        {ride.carType}
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        <User size={14} className="mr-1" />
                        {ride.seats} seats available
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${ecoImpactColors[ride.ecoImpact as keyof typeof ecoImpactColors]} border-0`}
                      >
                        {ride.ecoImpact === 'low' ? 'Low emission' : ride.ecoImpact === 'medium' ? 'Medium emission' : 'High emission'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 md:w-2/6 flex flex-col justify-between">
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-ecotopia-primary">${ride.price}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                    
                    <div className="text-center">
                      <Button className="w-full bg-ecotopia-primary hover:bg-ecotopia-light">
                        Request to Join
                      </Button>
                      <Button variant="link" className="mt-2 text-ecotopia-primary">
                        Message Driver
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No rides found matching your criteria.</p>
              <Button variant="outline" className="border-ecotopia-primary text-ecotopia-primary">
                Offer a Ride Instead
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarpoolMap;
