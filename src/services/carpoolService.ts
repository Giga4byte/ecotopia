import axios from 'axios';

export interface Location {
  lat: number;
  lon: number;
  address: string;
}

export interface CarpoolRoute {
  startLocation: Location;
  endLocation: Location;
  departureTime: Date;
  seats: number;
  price: number;
}

export interface MatchedRide {
  driver: CarpoolRoute;
  pickupPoint: Location;
  dropoffPoint: Location;
  estimatedDuration: number;
  distance: number;
  price: number;
}

class CarpoolService {
  private readonly OSRM_API_URL = 'https://router.project-osrm.org/route/v1/driving';
  private readonly NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

  async geocodeAddress(address: string): Promise<Location> {
    try {
      const response = await axios.get(`${this.NOMINATIM_API_URL}`, {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'Ecotopia-Carpool-App'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          address: result.display_name
        };
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  async calculateRoute(start: Location, end: Location): Promise<{
    distance: number;
    duration: number;
    geometry: string;
  }> {
    try {
      const response = await axios.get(
        `${this.OSRM_API_URL}/${start.lon},${start.lat};${end.lon},${end.lat}`,
        {
          params: {
            overview: 'full',
            geometries: 'geojson',
            steps: true
          }
        }
      );

      const route = response.data.routes[0];
      return {
        distance: route.distance, // meters
        duration: route.duration, // seconds
        geometry: route.geometry
      };
    } catch (error) {
      console.error('Routing error:', error);
      throw new Error('Failed to calculate route');
    }
  }

  async findMatches(userRoute: CarpoolRoute): Promise<MatchedRide[]> {
    // In a real application, this would query a database of available rides
    // For demo purposes, we'll create some mock matches
    const mockMatches: MatchedRide[] = [];
    
    try {
      const route = await this.calculateRoute(userRoute.startLocation, userRoute.endLocation);
      
      // Create some mock matched rides
      mockMatches.push({
        driver: {
          startLocation: {
            lat: userRoute.startLocation.lat + 0.01,
            lon: userRoute.startLocation.lon + 0.01,
            address: 'Nearby Start Location'
          },
          endLocation: {
            lat: userRoute.endLocation.lat + 0.01,
            lon: userRoute.endLocation.lon + 0.01,
            address: 'Nearby End Location'
          },
          departureTime: new Date(userRoute.departureTime.getTime() + 15 * 60000),
          seats: 3,
          price: 15
        },
        pickupPoint: userRoute.startLocation,
        dropoffPoint: userRoute.endLocation,
        estimatedDuration: route.duration,
        distance: route.distance,
        price: this.calculatePrice(route.distance)
      });
    } catch (error) {
      console.error('Error finding matches:', error);
      throw new Error('Failed to find matching rides');
    }

    return mockMatches;
  }

  private calculatePrice(distanceInMeters: number): number {
    // Basic price calculation: $1 per km with a minimum of $5
    const pricePerKm = 1;
    const minimumPrice = 5;
    const distanceInKm = distanceInMeters / 1000;
    return Math.max(minimumPrice, Math.round(distanceInKm * pricePerKm));
  }
}

export const carpoolService = new CarpoolService(); 