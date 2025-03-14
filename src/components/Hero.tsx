
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-ecotopia-primary to-ecotopia-light text-white py-16 md:py-28">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Sustainable Travel Made Simple
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 opacity-90">
          Plan eco-friendly itineraries, track your expenses, and find shared rides to reduce your carbon footprint while exploring the world.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-white text-ecotopia-primary hover:bg-gray-100 text-lg px-8 py-6">
            <Link to="/itinerary">
              Plan Your Trip
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-ecotopia-primary text-lg px-8 py-6">
            <Link to="/carpool">
              Find a Ride
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
