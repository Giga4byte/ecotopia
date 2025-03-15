import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { carpoolService, type Location, type CarpoolRoute, type MatchedRide } from '@/services/carpoolService';

interface RideSearchFormProps {
  type: 'find' | 'offer';
  onLocationsChange?: (start?: Location, end?: Location, matches?: MatchedRide[]) => void;
}

export default function RideSearchForm({ type, onLocationsChange }: RideSearchFormProps) {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [seats, setSeats] = useState('1');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchedRide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState<Location>();
  const [endLocation, setEndLocation] = useState<Location>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Geocode addresses
      const start = await carpoolService.geocodeAddress(startAddress);
      const end = await carpoolService.geocodeAddress(endAddress);

      setStartLocation(start);
      setEndLocation(end);

      // Create route object
      const route: CarpoolRoute = {
        startLocation: start,
        endLocation: end,
        departureTime: new Date(`${departureDate}T${departureTime}`),
        seats: parseInt(seats),
        price: 0 // Will be calculated by the service
      };

      // Find matches
      const foundMatches = await carpoolService.findMatches(route);
      setMatches(foundMatches);
      
      // Notify parent component about location changes
      onLocationsChange?.(start, end, foundMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onLocationsChange?.(undefined, undefined, []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="start">Start Location</Label>
          <Input
            id="start"
            value={startAddress}
            onChange={(e) => setStartAddress(e.target.value)}
            placeholder="Enter start address"
            required
          />
        </div>

        <div>
          <Label htmlFor="end">Destination</Label>
          <Input
            id="end"
            value={endAddress}
            onChange={(e) => setEndAddress(e.target.value)}
            placeholder="Enter destination address"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="seats">Number of Seats</Label>
          <Input
            id="seats"
            type="number"
            min="1"
            max="8"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-ecotopia-primary"
          disabled={loading}
        >
          {loading ? 'Searching...' : type === 'find' ? 'Find Rides' : 'Offer Ride'}
        </Button>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}

        {matches.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Available Matches</h3>
            {matches.map((match, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Route Details:</p>
                    <p className="text-sm text-gray-600">From: {match.pickupPoint.address}</p>
                    <p className="text-sm text-gray-600">To: {match.dropoffPoint.address}</p>
                    <p className="text-sm text-gray-600">
                      Duration: {Math.round(match.estimatedDuration / 60)} minutes
                    </p>
                    <p className="text-sm text-gray-600">
                      Distance: {(match.distance / 1000).toFixed(1)} km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-ecotopia-primary">
                      ${match.price}
                    </p>
                    <Button 
                      size="sm"
                      className="mt-2 bg-ecotopia-primary"
                      onClick={() => {
                        // Handle booking logic
                        alert('Booking functionality coming soon!');
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
} 