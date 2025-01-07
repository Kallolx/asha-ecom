import React, { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [selectedPackage, setSelectedPackage] = useState(product.packages[0]);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1 duration-300">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Organic Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#2B7A0B] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
          100% Organic
        </div>
        {/* Farm Fresh Badge */}
        {product.isFarmFresh && (
          <div className="absolute top-8 sm:top-12 left-2 sm:left-3 bg-[#FF8A00] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
            Farm Fresh
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-2.5 sm:p-4">
        {/* Delivery Time */}
        <div className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-sm mb-1.5 sm:mb-2">
          <FiClock className="text-[#2B7A0B] w-3 h-3 sm:w-4 sm:h-4" />
          <span>Delivery {product.deliveryTime}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2 sm:mb-3">{product.name}</h3>

        {/* Package Selection */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {product.packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-sm transition-colors ${
                selectedPackage.id === pkg.id
                  ? 'bg-[#2B7A0B] text-white'
                  : 'bg-[#F3F9F1] text-[#2B7A0B] hover:bg-[#E7F3E5]'
              }`}
            >
              {pkg.name}
            </button>
          ))}
        </div>

        {/* Price Display */}
        <div className="bg-[#F3F9F1] p-1.5 sm:p-2 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-[#2B7A0B] font-medium text-[10px] sm:text-sm">Price:</span>
            <div>
              <span className="text-[#2B7A0B] font-bold text-sm sm:text-xl">৳{selectedPackage.price}</span>
              <span className="text-gray-500 text-[8px] sm:text-sm ml-1">Per Pack</span>
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className="mt-3 text-[10px] sm:text-sm text-gray-600">
          {product.isFarmFresh ? (
            <div>
              <span className="text-[#2B7A0B]">✓</span> Farm Fresh
              <span className="text-[#2B7A0B] ml-2">✓</span> Quality Checked
            </div>
          ) : (
            <div>
              <span className="text-[#2B7A0B]">✓</span> Quality Checked
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('isPopular', '==', true));
        const querySnapshot = await getDocs(q);
        
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort products: Farm Fresh first, then others
        const sortedProducts = productsData.sort((a, b) => {
          if (a.isFarmFresh && !b.isFarmFresh) return -1;
          if (!a.isFarmFresh && b.isFarmFresh) return 1;
          return a.name.localeCompare(b.name);
        });

        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Group products by category for better organization
  const groupedProducts = products.reduce((acc, product) => {
    const group = product.isFarmFresh ? 'farmFresh' : 'others';
    if (!acc[group]) acc[group] = [];
    acc[group].push(product);
    return acc;
  }, {});

  return (
    <div className="py-8 sm:py-12 md:py-16 px-2 sm:px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-3 text-gray-800">Popular Products</h2>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">Our most loved organic products</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {/* Farm Fresh Products Section */}
            {groupedProducts.farmFresh?.length > 0 && (
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-[#2B7A0B] mb-4 sm:mb-6 flex items-center">
                  <span className="bg-[#FF8A00] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-sm mr-2 sm:mr-3">Farm Fresh</span>
                  Fresh from Our Farms
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                  {groupedProducts.farmFresh.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Products Section */}
            {groupedProducts.others?.length > 0 && (
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-[#2B7A0B] mb-4 sm:mb-6">
                  Other Popular Products
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                  {groupedProducts.others.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularProducts; 