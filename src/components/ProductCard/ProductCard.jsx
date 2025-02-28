import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FiClock, FiMinus, FiPlus } from 'react-icons/fi';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(product.packages?.[0] || null);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const handleAddToCart = () => {
    if (!selectedPackage && product.packages?.length > 0) {
      toast.error('Please select a package');
      return;
    }
    
    setIsAdding(true);
    addToCart({
      ...product,
      selectedPackage,
      quantity
    });

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
    
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!selectedPackage && product.packages?.length > 0) {
      toast.error('Please select a package');
      return;
    }
    
    setIsBuying(true);
    addToCart({
      ...product,
      selectedPackage,
      quantity
    });

    setTimeout(() => {
      setIsBuying(false);
      navigate('/checkout');
    }, 300);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const currentPrice = selectedPackage?.price || product.price;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1 duration-300">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden relative">
        <div 
          onClick={() => navigate(`/product/${product.id}`)}
          className="cursor-pointer w-full h-full"
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
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

      {/* Product Name and Delivery (Clickable) */}
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="cursor-pointer p-2.5 sm:p-4 pb-0"
      >
        {/* Delivery Time */}
        <div className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-sm mb-1.5 sm:mb-2">
          <FiClock className="text-[#2B7A0B] w-3 h-3 sm:w-4 sm:h-4" />
          <span>Delivery {product.deliveryTime}</span>
        </div>

        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2 sm:mb-3">{product.name}</h3>
      </div>

      {/* Interactive Section */}
      <div className="p-2.5 sm:p-4 pt-0" onClick={(e) => e.preventDefault()}>
        {/* Package Selection */}
        {product.packages?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4" onClick={(e) => e.stopPropagation()}>
            {product.packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePackageSelect(pkg);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-sm transition-colors ${
                  selectedPackage?.id === pkg.id
                    ? 'bg-[#2B7A0B] text-white'
                    : 'bg-[#F3F9F1] text-[#2B7A0B] hover:bg-[#E7F3E5]'
                }`}
              >
                {pkg.name}
              </button>
            ))}
          </div>
        )}

        {/* Price Display */}
        <div className="bg-[#F3F9F1] p-1.5 sm:p-2 rounded-lg mb-3 sm:mb-4">
          <div className="flex justify-between items-center">
            <span className="text-[#2B7A0B] font-medium text-[10px] sm:text-sm">Price:</span>
            <div>
              <span className="text-[#2B7A0B] font-bold text-sm sm:text-xl">৳{currentPrice}</span>
              <span className="text-gray-500 text-[8px] sm:text-sm ml-1">Per Pack</span>
            </div>
          </div>
        </div>

        {/* Quality Badges */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {product.isFarmFresh ? (
            <div className="text-[10px] sm:text-sm text-gray-600">
              <span className="text-[#2B7A0B]">✓</span> Farm Fresh
              <span className="text-[#2B7A0B] ml-2">✓</span> Quality Checked
            </div>
          ) : (
            <div className="text-[10px] sm:text-sm text-gray-600">
              <span className="text-[#2B7A0B]">✓</span> Quality Checked
            </div>
          )}
          <div className="flex items-center gap-1 sm:gap-2 bg-[#F3F9F1] rounded-full" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                decrementQuantity();
              }}
              className="p-1.5 sm:p-2 hover:text-[#2B7A0B] transition-colors"
            >
              <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <span className="w-6 sm:w-8 text-center font-medium text-xs sm:text-base">{quantity}</span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                incrementQuantity();
              }}
              className="p-1.5 sm:p-2 hover:text-[#2B7A0B] transition-colors"
            >
              <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Add to Cart Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isAdding}
            className={`flex-1 bg-[#F3F9F1] hover:bg-[#E7F3E5] text-[#2B7A0B] py-2 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 ${
              isAdding ? 'scale-95 opacity-75' : ''
            }`}
          >
            <FaShoppingCart className={`w-4 h-4 transform transition-transform duration-500 ${
              isAdding ? 'rotate-[360deg] scale-110' : ''
            }`} />
            <span className="hidden sm:inline text-sm font-medium">
              {isAdding ? 'Added!' : 'Add to Cart'}
            </span>
          </button>

          {/* Buy Now Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBuyNow();
            }}
            disabled={isBuying}
            className={`flex-1 bg-[#2B7A0B] hover:bg-[#236209] text-white py-2 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 ${
              isBuying ? 'scale-95 opacity-75' : ''
            }`}
          >
            <span className="text-sm font-medium">
              {isBuying ? 'Processing...' : 'Buy Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;