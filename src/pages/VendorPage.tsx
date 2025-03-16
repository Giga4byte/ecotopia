import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VendorPortal from '@/components/VendorPortal';

const VendorPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-ecotopia-primary text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Eco-Friendly Products</h1>
            <p className="max-w-3xl opacity-90">
              Discover and manage sustainable products from eco-conscious vendors. 
              Connect with artisans and businesses committed to environmental stewardship.
            </p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <VendorPortal />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorPage; 