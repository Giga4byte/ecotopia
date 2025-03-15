import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { type Location } from '@/services/carpoolService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Car, Calendar, User, MapPin, Clock, Shield, Star, Phone, Sun } from 'lucide-react';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SafetyFeatures {
  isVerifiedDriver: boolean;
  safetyRating: number;
  wellLitPickup: boolean;
  hasEmergencyButton: boolean;
  womenOnly: boolean;
  totalSafetyReviews: number;
}

interface Driver {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  rating: number;
  rides: number;
  avatar: string;
  safetyFeatures: SafetyFeatures;
}

interface CarpoolRide {
  pickupPoint: Location;
  dropoffPoint: Location;
  driver: Driver;
  departureTime: string;
  price: number;
}

interface CarpoolMapProps {
  startLocation?: Location;
  endLocation?: Location;
  matches?: CarpoolRide[];
  onEmergencyContact?: () => void;
  showWomenOnly?: boolean;
}

// Safety rating component
const SafetyRating = ({ rating, totalReviews }: { rating: number; totalReviews: number }) => (
  <div className="flex items-center space-x-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ))}
    <span className="text-sm text-gray-600">({totalReviews} safety reviews)</span>
  </div>
);

// Safety badges component
const SafetyBadges = ({ features }: { features: SafetyFeatures }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {features.isVerifiedDriver && (
      <Badge variant="outline" className="bg-blue-50">
        <Shield className="w-3 h-3 mr-1" /> Verified Driver
      </Badge>
    )}
    {features.wellLitPickup && (
      <Badge variant="outline" className="bg-yellow-50">
        <Sun className="w-3 h-3 mr-1" /> Well-lit Pickup
      </Badge>
    )}
    {features.womenOnly && (
      <Badge variant="outline" className="bg-purple-50">
        <User className="w-3 h-3 mr-1" /> Women Only
      </Badge>
    )}
    {features.hasEmergencyButton && (
      <Badge variant="outline" className="bg-red-50">
        <Phone className="w-3 h-3 mr-1" /> Emergency Contact
      </Badge>
    )}
  </div>
);

// Component to handle map bounds
function MapBounds({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = new L.LatLngBounds(
        locations.map(loc => [loc.lat, loc.lon])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

// Enhanced route layer with safety indicators
function RouteLayer({ start, end, isWellLit }: { start: Location; end: Location; isWellLit: boolean }) {
  const map = useMap();

  useEffect(() => {
    const drawRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          const routeLayer = L.geoJSON(data.routes[0].geometry);
          routeLayer.setStyle({ 
            color: isWellLit ? '#10B981' : '#3B82F6', // Green for well-lit routes, blue for standard
            weight: 4,
            opacity: 0.8,
            dashArray: isWellLit ? null : '5, 10' // Dashed line for non-well-lit routes
          });
          routeLayer.addTo(map);
          
          return () => {
            map.removeLayer(routeLayer);
          };
        }
      } catch (error) {
        console.error('Error drawing route:', error);
      }
    };

    drawRoute();
  }, [start, end, map, isWellLit]);

  return null;
}

// Custom marker for safe pickup points
const SafePickupMarker = ({ position, children }: { position: [number, number]; children: React.ReactNode }) => (
  <Marker
    position={position}
    icon={new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })}
  >
    {children}
  </Marker>
);

export default function CarpoolMap({ startLocation, endLocation, matches, onEmergencyContact, showWomenOnly }: CarpoolMapProps) {
  const [defaultCenter] = useState<[number, number]>([51.505, -0.09]);
  const [defaultZoom] = useState(13);
  const [safetyFilters, setSafetyFilters] = useState({
    womenOnly: showWomenOnly || false,
    verifiedOnly: false,
    wellLitOnly: false,
    emergencyButtonOnly: false
  });

  // Filter rides based on all safety preferences
  const filteredMatches = matches?.filter(match => {
    const matchWomenOnly = !safetyFilters.womenOnly || match.driver.gender === 'female';
    const matchVerified = !safetyFilters.verifiedOnly || match.driver.safetyFeatures.isVerifiedDriver;
    const matchWellLit = !safetyFilters.wellLitOnly || match.driver.safetyFeatures.wellLitPickup;
    const matchEmergency = !safetyFilters.emergencyButtonOnly || match.driver.safetyFeatures.hasEmergencyButton;
    
    return matchWomenOnly && matchVerified && matchWellLit && matchEmergency;
  });

  const allLocations = [
    ...(startLocation ? [startLocation] : []),
    ...(endLocation ? [endLocation] : []),
    ...(filteredMatches?.flatMap(match => [match.pickupPoint, match.dropoffPoint]) || [])
  ];

  return (
    <div className="space-y-4">
      {/* Safety Filters */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-600" />
            Safety Filters
          </CardTitle>
          <CardDescription>
            Select your safety preferences for a more secure journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-purple-100">
              <input
                type="checkbox"
                id="womenOnly"
                checked={safetyFilters.womenOnly}
                onChange={(e) => setSafetyFilters(prev => ({ ...prev, womenOnly: e.target.checked }))}
                className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="womenOnly" className="flex items-center text-sm font-medium text-gray-700">
                <User className="w-4 h-4 mr-2 text-purple-600" />
                Women Drivers Only
              </label>
            </div>

            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-purple-100">
              <input
                type="checkbox"
                id="verifiedOnly"
                checked={safetyFilters.verifiedOnly}
                onChange={(e) => setSafetyFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="verifiedOnly" className="flex items-center text-sm font-medium text-gray-700">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                Verified Drivers Only
              </label>
            </div>

            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-purple-100">
              <input
                type="checkbox"
                id="wellLitOnly"
                checked={safetyFilters.wellLitOnly}
                onChange={(e) => setSafetyFilters(prev => ({ ...prev, wellLitOnly: e.target.checked }))}
                className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="wellLitOnly" className="flex items-center text-sm font-medium text-gray-700">
                <Sun className="w-4 h-4 mr-2 text-yellow-600" />
                Well-lit Pickup Points Only
              </label>
            </div>

            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-purple-100">
              <input
                type="checkbox"
                id="emergencyButtonOnly"
                checked={safetyFilters.emergencyButtonOnly}
                onChange={(e) => setSafetyFilters(prev => ({ ...prev, emergencyButtonOnly: e.target.checked }))}
                className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="emergencyButtonOnly" className="flex items-center text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4 mr-2 text-red-600" />
                Emergency Button Available
              </label>
            </div>
          </div>

          {/* Active Filters Summary */}
          {Object.values(safetyFilters).some(Boolean) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {safetyFilters.womenOnly && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  Women Drivers Only
                </Badge>
              )}
              {safetyFilters.verifiedOnly && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Verified Drivers
                </Badge>
              )}
              {safetyFilters.wellLitOnly && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Well-lit Pickups
                </Badge>
              )}
              {safetyFilters.emergencyButtonOnly && (
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  Emergency Button
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {allLocations.length > 0 && (
            <MapBounds locations={allLocations} />
          )}

          {filteredMatches?.map((match, index) => (
            <RouteLayer 
              key={`route-${index}`}
              start={match.pickupPoint}
              end={match.dropoffPoint}
              isWellLit={match.driver.safetyFeatures.wellLitPickup}
            />
          ))}

          {startLocation && (
            <Marker position={[startLocation.lat, startLocation.lon]}>
              <Popup>Start: {startLocation.address}</Popup>
            </Marker>
          )}

          {endLocation && (
            <Marker position={[endLocation.lat, endLocation.lon]}>
              <Popup>Destination: {endLocation.address}</Popup>
            </Marker>
          )}

          {filteredMatches?.map((match, index) => (
            <>
              <SafePickupMarker
                key={`pickup-${index}`}
                position={[match.pickupPoint.lat, match.pickupPoint.lon]}
              >
                <Popup>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Pickup: {match.pickupPoint.address}</h3>
                    <SafetyBadges features={match.driver.safetyFeatures} />
                    <div className="text-sm text-gray-600">
                      <p>Driver: {match.driver.name}</p>
                      <SafetyRating 
                        rating={match.driver.safetyFeatures.safetyRating}
                        totalReviews={match.driver.safetyFeatures.totalSafetyReviews}
                      />
                    </div>
                    {match.driver.safetyFeatures.hasEmergencyButton && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={onEmergencyContact}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Emergency Contact
                      </Button>
                    )}
                  </div>
                </Popup>
              </SafePickupMarker>
              <Marker
                key={`dropoff-${index}`}
                position={[match.dropoffPoint.lat, match.dropoffPoint.lon]}
                icon={new L.Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>Dropoff: {match.dropoffPoint.address}</Popup>
              </Marker>
            </>
          ))}
        </MapContainer>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold flex items-center">
          <Shield className="w-4 h-4 mr-2 text-yellow-600" />
          Safety Features
        </h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center">
            <Badge variant="outline" className="bg-blue-50 mr-2">
              <Shield className="w-3 h-3 mr-1" />
            </Badge>
            Verified drivers have undergone background checks
          </li>
          <li className="flex items-center">
            <Badge variant="outline" className="bg-yellow-50 mr-2">
              <Sun className="w-3 h-3 mr-1" />
            </Badge>
            Well-lit pickup points are monitored and in safe areas
          </li>
          <li className="flex items-center">
            <Badge variant="outline" className="bg-purple-50 mr-2">
              <User className="w-3 h-3 mr-1" />
            </Badge>
            Women-only rides are available for added comfort
          </li>
          <li className="flex items-center">
            <Badge variant="outline" className="bg-red-50 mr-2">
              <Phone className="w-3 h-3 mr-1" />
            </Badge>
            Emergency contact button connects to 24/7 support
          </li>
        </ul>
      </div>
    </div>
  );
}
