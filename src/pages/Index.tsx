
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import { Map, Wallet, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ecotopia?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Map size={24} />}
                title="Eco-friendly Itineraries"
                description="Plan your travels with sustainable destinations, accommodations, and activities that minimize environmental impact."
                link="/itinerary"
              />
              <FeatureCard 
                icon={<Wallet size={24} />}
                title="Budget Tracking"
                description="Keep your expenses organized with real-time tracking and analysis. Get eco-saving suggestions to travel more sustainably."
                link="/itinerary"
              />
              <FeatureCard 
                icon={<Users size={24} />}
                title="Carpooling System"
                description="Connect with fellow travelers headed in the same direction to share rides, reduce emissions, and make new friends."
                link="/carpool"
              />
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  At Ecotopia, we believe that traveling should not come at the expense of our planet. Our mission is to empower travelers with tools to make more sustainable choices, reduce their carbon footprint, and connect with like-minded eco-tourists.
                </p>
                <p className="text-gray-600 mb-6">
                  Through our innovative features, we aim to transform how people explore the world, making sustainable tourism the new standard for adventurers everywhere.
                </p>
                <Button asChild className="bg-ecotopia-primary hover:bg-ecotopia-light text-white">
                  <Link to="/itinerary">Get Started</Link>
                </Button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb" 
                  alt="Sustainable tourism landscape" 
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-ecotopia-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Travel Sustainably?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of eco-conscious travelers planning their next adventure with Ecotopia.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-ecotopia-primary hover:bg-ecotopia-light text-white text-lg px-8 py-6">
                <Link to="/itinerary">
                  Plan Your Eco-Trip
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-ecotopia-dark text-lg px-8 py-6">
                <Link to="/carpool">
                  Find Shared Rides
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
