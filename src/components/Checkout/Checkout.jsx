import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiMapPin, FiPhone, FiUser, FiMessageSquare, FiTag, FiArrowLeft, FiClock, FiCheck, FiTruck, FiPackage } from 'react-icons/fi';
import OrderSuccess from '../Order/OrderSuccess';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const Checkout = ({ isOpen, onClose }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    coupon: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'coupon' && value === '') {
      setDiscount(0);
      setAppliedCoupon(false);
    }
  };

  const validateAndApplyCoupon = () => {
    const subtotal = getCartTotal();
    if (formData.coupon.toUpperCase() === 'ASHA50') {
      if (subtotal < 299) {
        toast.error('Minimum order amount should be ৳299 to use this coupon');
        return;
      }
      if (appliedCoupon) {
        toast.error('Coupon already applied');
        return;
      }
      const discountAmount = subtotal * 0.10;
      setDiscount(discountAmount);
      setAppliedCoupon(true);
      toast.success('Coupon applied successfully! 10% discount added');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const getFinalTotal = () => {
    const subtotal = getCartTotal();
    return subtotal - discount;
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const order = {
        orderNumber: generateOrderNumber(),
        orderDate: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        delivery: formData,
        subtotal: getCartTotal(),
        discount: discount,
        total: getFinalTotal(),
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        createdAt: serverTimestamp()
      };

      const adminOrderRef = await addDoc(collection(db, 'orders'), order);
      await addDoc(collection(db, `users/${user.uid}/orders`), {
        ...order,
        orderId: adminOrderRef.id
      });

      setOrderDetails({
        ...order,
        orderDate: new Date().toISOString()
      });
      setOrderSuccess(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess && orderDetails) {
    return <OrderSuccess order={orderDetails} onClose={onClose} />;
  }

  if (cartItems.length === 0) {
    return (
      <div className={`fixed inset-0 z-50 bg-white transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 ml-2">Checkout</h1>
          </div>
          <div className="text-center py-12">
            <div className="text-[#2B7A0B] mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some products to your cart to proceed with checkout</p>
            <button
              onClick={onClose}
              className="bg-[#2B7A0B] text-white px-8 py-3 rounded-full hover:bg-[#236209] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 bg-[#F9FAFB] transition-opacity duration-300 overflow-y-auto ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Header with Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 ml-2">Secure Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
              <div className="h-full bg-[#2B7A0B] w-1/3" />
            </div>

            {/* Steps */}
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#2B7A0B] text-white flex items-center justify-center mb-2">
                <FiUser className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Details</span>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-2">
                <FiTruck className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">Delivery</span>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-2">
                <FiPackage className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E7F3E5] flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-[#2B7A0B]" />
                  </div>
                  <h2 className="text-lg font-semibold">Contact Information</h2>
                </div>
                {user && (
                  <div className="text-sm text-gray-600">
                    Signed in as {user.email}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#E7F3E5] flex items-center justify-center">
                  <FiMapPin className="w-5 h-5 text-[#2B7A0B]" />
                </div>
                <h2 className="text-lg font-semibold">Delivery Address</h2>
              </div>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent transition-all"
                placeholder="Enter your full address"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.package.id}`} className="flex gap-4 py-3 border-b last:border-0">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#2B7A0B] text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.package.name}</p>
                      <p className="text-[#2B7A0B] font-medium mt-1">৳{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="coupon"
                    value={formData.coupon}
                    onChange={handleChange}
                    className="flex-1 py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent transition-all text-sm"
                    placeholder="Enter coupon code"
                  />
                  <button
                    type="button"
                    onClick={validateAndApplyCoupon}
                    className="px-6 py-3 bg-[#2B7A0B] text-white rounded-xl hover:bg-[#236209] transition-colors text-sm font-medium"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <FiTag className="text-[#2B7A0B]" />
                  Use code ASHA50 to get 10% discount on orders above ৳299
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-[#2B7A0B] font-medium">Free</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-[#2B7A0B]">
                    <span>Discount (10%)</span>
                    <span>-৳{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span className="text-[#2B7A0B]">৳{getFinalTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-br from-[#FFF9E5] to-[#FFEDD5] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FF8A00] bg-opacity-20 flex items-center justify-center">
                  <FiClock className="w-5 h-5 text-[#FF8A00]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#FF8A00]">Delivery Information</h3>
                  <p className="text-sm text-gray-600">Estimated delivery time: 2-3 hours</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCheck className="text-[#2B7A0B] w-5 h-5" />
                  <span>First 10 orders: FREE delivery!</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCheck className="text-[#2B7A0B] w-5 h-5" />
                  <span>After 10 orders: ৳10-20 (based on distance)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keep the existing sticky button */}
        <button 
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[500px] bg-[#2B7A0B] text-white py-4 rounded-full font-medium hover:bg-[#236209] transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 shadow-lg z-50"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Place Order • ৳{getFinalTotal().toFixed(2)}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout; 