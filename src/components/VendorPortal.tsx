import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Store, 
  Package, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Star,
  MapPin,
  Leaf,
  X,
  Globe,
  EyeOff
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  materials: string[];
  sustainability: string[];
  category: string;
  stock: number;
}

interface VendorProfile {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  specialties: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

const VendorPortal = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isPublished, setIsPublished] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Organic Cotton Shawl',
      description: 'Handwoven shawl using organic cotton and natural dyes',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
      materials: ['Organic Cotton', 'Natural Dyes'],
      sustainability: ['Zero Waste', 'Fair Trade'],
      category: 'Textiles',
      stock: 15
    },
    {
      id: 2,
      name: 'Bamboo Storage Box',
      description: 'Handcrafted storage box made from sustainable bamboo',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      materials: ['Bamboo', 'Natural Finishes'],
      sustainability: ['Renewable Resource', 'Biodegradable'],
      category: 'Home & Living',
      stock: 8
    }
  ]);

  const [profile, setProfile] = useState<VendorProfile>({
    id: 1,
    name: 'EcoCraft India',
    location: 'Jaipur, Rajasthan',
    description: 'Traditional artisans crafting sustainable products using natural materials and eco-friendly dyes.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    specialties: ['Handloom Textiles', 'Natural Dyes', 'Upcycled Products'],
    coordinates: { lat: 26.9124, lng: 75.7873 }
  });

  const handleAddProduct = () => {
    // Add new product logic
  };

  const handleEditProduct = (productId: number) => {
    // Edit product logic
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handlePublish = () => {
    setIsPublished(!isPublished);
    // Here you would typically make an API call to update the publish status
    // For now, we'll just show a success message
    if (!isPublished) {
      alert('Profile published successfully! Your products are now visible to customers.');
    } else {
      alert('Profile unpublished. Your products are now hidden from customers.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Vendor Profile</CardTitle>
                  <CardDescription>Manage your vendor profile and information</CardDescription>
                </div>
                <Button
                  onClick={handlePublish}
                  className={`flex items-center gap-2 ${
                    isPublished 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-ecotopia-primary hover:bg-ecotopia-light text-white'
                  }`}
                >
                  {isPublished ? (
                    <>
                      <EyeOff size={16} />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Globe size={16} />
                      Publish Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={profile.image} 
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 bg-ecotopia-primary hover:bg-ecotopia-light"
                    >
                      <Upload size={16} />
                    </Button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{profile.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-600 flex items-center">
                      <MapPin size={14} className="mr-1" /> {profile.location}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Star size={14} className="mr-1" /> {profile.rating}/5
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialties
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {specialty}
                        <button 
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setProfile({
                              ...profile,
                              specialties: profile.specialties.filter((_, i) => i !== index)
                            });
                          }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const newSpecialty = prompt('Enter new specialty:');
                        if (newSpecialty) {
                          setProfile({
                            ...profile,
                            specialties: [...profile.specialties, newSpecialty]
                          });
                        }
                      }}
                    >
                      <Plus size={12} className="mr-1" /> Add Specialty
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Products</h2>
            <Button 
              className="bg-ecotopia-primary hover:bg-ecotopia-light"
              onClick={handleAddProduct}
            >
              <Plus size={16} className="mr-2" /> Add Product
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id}>
                <div className="relative h-48">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-green-600">₹{product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.materials.map((material, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                        {material}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.sustainability.map((feature, index) => (
                      <span key={index} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Notifications
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      New orders
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Product reviews
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Marketing updates
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Opening Time</label>
                      <Input type="time" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Closing Time</label>
                      <Input type="time" className="mt-1" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Settings
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Enable free shipping for orders above ₹5000
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Use eco-friendly packaging
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorPortal;
