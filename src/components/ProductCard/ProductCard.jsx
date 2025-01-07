import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FiShoppingBag, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(product.packages?.[0] || null);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    if (!selectedPackage && product.packages?.length > 0) {
      toast.error('Please select a package');
      return;
    }
    
    addToCart({
      ...product,
      selectedPackage,
      quantity
    });
    toast.success('Added to cart');
  };

  const handlePackageSelect = (e, pkg) => {
    e.stopPropagation(); // Prevent navigation when selecting package
    setSelectedPackage(pkg);
  };

  const handleQuantityChange = (e, newQuantity) => {
    e.stopPropagation(); // Prevent navigation when changing quantity
    setQuantity(newQuantity);
  };

  const currentPrice = selectedPackage?.price || product.price;
  const marketPrice = (currentPrice * 1.15).toFixed(2);

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-[#2B7A0B]/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
            100% Organic
          </span>
          {product.isFarmFresh && (
            <span className="bg-[#FF8A00]/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
              Farm Fresh
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Delivery Time */}
        <div className="text-[10px] text-gray-500 mb-1">
          Delivery in {product.deliveryTime}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Package Selection */}
        {product.packages?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.packages.map((pkg) => (
              <button
                key={pkg.size}
                onClick={(e) => handlePackageSelect(e, pkg)}
                className={`
                  text-[10px] px-2 py-1 rounded-full transition-colors
                  ${selectedPackage?.size === pkg.size
                    ? 'bg-[#2B7A0B] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {pkg.size}
              </button>
            ))}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] text-gray-500 line-through">৳{marketPrice}</div>
            <div className="text-sm font-semibold text-[#2B7A0B]">
              ৳{currentPrice.toFixed(2)}
              <span className="text-[10px] font-normal text-gray-500 ml-1">Per Pack</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-[#2B7A0B] font-medium">
              Save {((marketPrice - currentPrice) / marketPrice * 100).toFixed(0)}%
            </div>
            {product.isWholesale && (
              <div className="text-[10px] text-[#2B7A0B]">Wholesale Pack</div>
            )}
          </div>
        </div>

        {/* Quality Badges */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <FiCheck className="text-[#2B7A0B] w-3 h-3" />
            <span className="text-[10px] text-gray-600">Farm Fresh</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCheck className="text-[#2B7A0B] w-3 h-3" />
            <span className="text-[10px] text-gray-600">Quality Checked</span>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center justify-between">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              key="decrease-quantity"
              onClick={(e) => handleQuantityChange(e, Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 h-7 flex items-center justify-center text-sm border-x border-gray-200">
              {quantity}
            </span>
            <button
              key="increase-quantity"
              onClick={(e) => handleQuantityChange(e, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <button
            key="add-to-cart"
            onClick={handleAddToCart}
            className="bg-[#2B7A0B] hover:bg-[#236209] text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
          >
            <FiShoppingBag className="w-3 h-3" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;