import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { type Location } from '@/services/carpoolService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Car, Calendar, User, MapPin, Clock } from 'lucide-react';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CarpoolMapProps {
  startLocation?: Location;
  endLocation?: Location;
  matches?: Array<{
    pickupPoint: Location;
    dropoffPoint: Location;
  }>;
}

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

// Component to draw route
function RouteLayer({ start, end }: { start: Location; end: Location }) {
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
          routeLayer.setStyle({ color: '#3B82F6', weight: 4 });
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
  }, [start, end, map]);

  return null;
}

export default function CarpoolMap({ startLocation, endLocation, matches }: CarpoolMapProps) {
  const [defaultCenter] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [defaultZoom] = useState(13);

  // Collect all locations to show on the map
  const allLocations = [
    ...(startLocation ? [startLocation] : []),
    ...(endLocation ? [endLocation] : []),
    ...(matches?.flatMap(match => [match.pickupPoint, match.dropoffPoint]) || [])
  ];

  return (
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

        {startLocation && endLocation && (
          <RouteLayer start={startLocation} end={endLocation} />
        )}

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

        {matches?.map((match, index) => (
          <>
            <Marker
              key={`pickup-${index}`}
              position={[match.pickupPoint.lat, match.pickupPoint.lon]}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>Pickup: {match.pickupPoint.address}</Popup>
            </Marker>
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
  );
}
