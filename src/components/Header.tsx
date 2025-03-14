
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Leaf, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-ecotopia-primary" />
          <span className="text-xl font-bold text-ecotopia-dark">Ecotopia</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-ecotopia-dark"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-ecotopia-dark hover:text-ecotopia-primary transition-colors">
            Home
          </Link>
          <Link to="/itinerary" className="text-ecotopia-dark hover:text-ecotopia-primary transition-colors">
            Itinerary Planner
          </Link>
          <Link to="/carpool" className="text-ecotopia-dark hover:text-ecotopia-primary transition-colors">
            Carpooling
          </Link>
          <Button className="bg-ecotopia-primary hover:bg-ecotopia-light text-white transition-colors">
            Sign Up
          </Button>
        </nav>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden z-50">
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/" 
                className="text-ecotopia-dark hover:text-ecotopia-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/itinerary" 
                className="text-ecotopia-dark hover:text-ecotopia-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Itinerary Planner
              </Link>
              <Link 
                to="/carpool" 
                className="text-ecotopia-dark hover:text-ecotopia-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Carpooling
              </Link>
              <Button className="bg-ecotopia-primary hover:bg-ecotopia-light text-white transition-colors w-full">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
