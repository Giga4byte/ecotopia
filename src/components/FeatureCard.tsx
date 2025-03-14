
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

const FeatureCard = ({ icon, title, description, link }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg border border-gray-100">
      <div className="w-12 h-12 rounded-full bg-ecotopia-primary bg-opacity-10 flex items-center justify-center text-ecotopia-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-ecotopia-dark">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link 
        to={link} 
        className="inline-flex items-center text-ecotopia-primary hover:underline transition-colors font-medium"
      >
        Learn more <ArrowRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default FeatureCard;
