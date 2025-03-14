
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ecotopia-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-ecotopia-light" />
              <span className="text-xl font-bold">Ecotopia</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Empowering travelers to explore sustainably, reduce their carbon footprint,
              and connect with like-minded eco-tourists.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-ecotopia-light transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/itinerary" className="text-gray-300 hover:text-ecotopia-light transition-colors">
                  Itinerary Planner
                </Link>
              </li>
              <li>
                <Link to="/carpool" className="text-gray-300 hover:text-ecotopia-light transition-colors">
                  Carpooling
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-ecotopia-light" />
                <span className="text-gray-300">info@ecotopia.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-ecotopia-light" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-ecotopia-light" />
                <span className="text-gray-300">123 Green Street, Eco City</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for eco-friendly travel tips.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-md w-full focus:outline-none text-ecotopia-dark"
              />
              <button className="bg-ecotopia-primary hover:bg-ecotopia-light transition-colors px-4 py-2 rounded-r-md">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Ecotopia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
