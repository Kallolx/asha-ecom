import React, { useState } from 'react';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Checkout from '../Checkout/Checkout';
import AuthModal from '../Auth/AuthModal';
import toast from 'react-hot-toast';

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleProceedToCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast.error('Please sign in to proceed with checkout');
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <>
      {/* Hidden checkout trigger button */}
      <button
        data-checkout-trigger
        onClick={handleProceedToCheckout}
        className="hidden"
      />

      <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop with fade */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
          onClick={onClose}
        />

        {/* Cart Panel - Full screen on mobile, slide on desktop */}
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className={`relative w-screen max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-3 sm:p-4 border-b bg-white">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Shopping Cart ({cartItems.length})</h2>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 max-h-[calc(100vh-8rem)]">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                  <FiShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mb-4 text-[#2B7A0B] opacity-50" />
                  <p className="font-medium mb-2 text-sm sm:text-base">Your cart is empty</p>
                  <p className="text-xs sm:text-sm text-gray-400 text-center">
                    Browse our products and add items to your cart
                  </p>
                  <button 
                    onClick={onClose}
                    className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 bg-[#2B7A0B] text-white rounded-full hover:bg-[#236209] transition-colors text-sm sm:text-base"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={`${item.id}-${item.package.id}`} 
                      className="flex gap-3 sm:gap-4 bg-white rounded-lg p-2 sm:p-3 border transform transition-all duration-200 hover:shadow-md"
                    >
                      {/* Product Image */}
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{item.package.name}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <button 
                              onClick={() => updateQuantity(item.id, item.package.id, Math.max(1, item.quantity - 1))}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <FiMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <span className="w-7 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.package.id, item.quantity + 1)}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id, item.package.id)}
                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-medium text-[#2B7A0B] text-sm sm:text-base">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          ৳{item.price} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section with Total and Checkout */}
            {cartItems.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t p-3 sm:p-4">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-sm sm:text-base text-gray-600">Total Amount:</span>
                  <span className="text-lg sm:text-xl font-bold text-[#2B7A0B]">৳{getCartTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  data-checkout-trigger
                  className="w-full bg-[#2B7A0B] text-white py-2.5 sm:py-3 rounded-full font-medium hover:bg-[#236209] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Checkout 
        isOpen={isCheckoutOpen} 
        onClose={() => {
          setIsCheckoutOpen(false);
          onClose();
        }} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default CartModal; 