import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { FaShoppingCart, FaLeaf } from 'react-icons/fa';
import { TbCertificate } from 'react-icons/tb';
import { useCart } from '../context/CartContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() };
          setProduct(productData);
          setSelectedPackage(productData.packages[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedPackage, quantity);

    toast.success(
      <div className="flex items-center gap-2">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-500">Added to cart</p>
        </div>
      </div>,
      {
        duration: 2000,
        position: 'bottom-center',
        className: 'bg-white shadow-lg',
        icon: '🛒',
      }
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Product not found</p>
      </div>
    );
  }

  // Calculate market price (15% higher than our price)
  const getMarketPrice = (price) => (price * 1.15).toFixed(2);

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#2B7A0B] mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Popular Products</span>
        </button>

        {/* Product Detail Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-[#2B7A0B] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <FaLeaf />
                  <span>100% Organic</span>
                </div>
                {product.isFarmFresh && (
                  <div className="bg-[#FF8A00] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Farm Fresh
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <FiClock className="text-[#2B7A0B]" />
                <span>Delivery in {product.deliveryTime}</span>
              </div>

              {/* Package Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Select Package</h3>
                <div className="flex flex-wrap gap-2">
                  {product.packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        selectedPackage?.id === pkg.id
                          ? 'bg-[#2B7A0B] text-white'
                          : 'bg-[#F3F9F1] text-[#2B7A0B] hover:bg-[#E7F3E5]'
                      }`}
                    >
                      {pkg.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Comparison */}
              <div className="bg-[#F3F9F1] p-4 rounded-xl mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Market Price:</span>
                    <span className="text-gray-500 text-lg line-through">৳{getMarketPrice(selectedPackage?.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#2B7A0B] font-medium">Our Price:</span>
                    <div>
                      <span className="text-[#2B7A0B] font-bold text-2xl">৳{selectedPackage?.price}</span>
                      <span className="text-gray-500 text-sm ml-1">Per Pack</span>
                    </div>
                  </div>
                  <div className="text-[#2B7A0B] text-sm mt-1">
                    Save up to 15% on market price
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-2 bg-[#F3F9F1] rounded-full">
                  <button 
                    onClick={decrementQuantity}
                    className="p-2 hover:text-[#2B7A0B] transition-colors"
                  >
                    <FiMinus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="p-2 hover:text-[#2B7A0B] transition-colors"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full bg-[#2B7A0B] hover:bg-[#236209] text-white py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${
                  isAdding ? 'scale-95 opacity-75' : ''
                }`}
              >
                <FaShoppingCart className={`w-5 h-5 transform transition-transform duration-500 ${
                  isAdding ? 'rotate-[360deg] scale-110' : ''
                }`} />
                <span className="text-lg">{isAdding ? 'Added!' : 'Add to Cart'}</span>
              </button>

              {/* Product Features */}
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <TbCertificate className="text-[#2B7A0B] w-5 h-5" />
                  <span>Quality Checked</span>
                </div>
                {product.isFarmFresh && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaLeaf className="text-[#2B7A0B] w-5 h-5" />
                    <span>Farm Fresh Guarantee</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 