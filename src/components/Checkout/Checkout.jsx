import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiMapPin, FiPhone, FiUser, FiMessageSquare, FiTag, FiArrowLeft } from 'react-icons/fi';
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
    notes: '',
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

    // Reset coupon if coupon field is cleared
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
      const discountAmount = subtotal * 0.10; // 10% discount
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

      // Save to admin orders collection
      const adminOrderRef = await addDoc(collection(db, 'orders'), order);

      // Save to user orders collection
      await addDoc(collection(db, `users/${user.uid}/orders`), {
        ...order,
        orderId: adminOrderRef.id
      });

      setOrderDetails({
        ...order,
        orderDate: new Date().toISOString() // Convert to ISO string for display
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

  const handleCloseSuccess = () => {
    setOrderSuccess(false);
    onClose();
  };

  if (orderSuccess && orderDetails) {
    return <OrderSuccess order={orderDetails} onClose={handleCloseSuccess} />;
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
    <div className={`fixed inset-0 z-50 bg-white transition-opacity duration-300 overflow-y-auto ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ml-2">Checkout</h1>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-[#F3F9F1] rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-3 text-lg">Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.package.id}`} className="flex justify-between text-sm">
                  <div className="flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">{item.package.name} x {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>৳{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Delivery Fee</span>
                  <span className="text-[#2B7A0B]">Free for first 10 orders!</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm mt-2 text-[#2B7A0B]">
                    <span>Discount (10%)</span>
                    <span>-৳{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold mt-3 pt-3 border-t text-base">
                  <span>Total Amount</span>
                  <span className="text-[#2B7A0B]">৳{getFinalTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h2 className="font-semibold text-yellow-800 mb-2 text-lg">Delivery Information</h2>
            <div className="space-y-1 text-sm text-yellow-800">
              <p>• First 10 orders: FREE delivery!</p>
              <p>• After 10 orders: ৳10-20 (based on distance)</p>
              <p>• Estimated delivery time: 2-3 hours</p>
            </div>
          </div>

          {/* Delivery Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg">
              <h2 className="font-semibold text-gray-800 mb-4 text-lg">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent text-base"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent text-base"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FiMapPin className="text-gray-400 w-5 h-5" />
                    </div>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="pl-10 w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent text-base"
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Have a Coupon?
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTag className="text-gray-400 w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="coupon"
                        value={formData.coupon}
                        onChange={handleChange}
                        className="pl-10 w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent text-base"
                        placeholder="Enter coupon code"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={validateAndApplyCoupon}
                      className="px-4 py-2 bg-[#2B7A0B] text-white rounded-lg hover:bg-[#236209] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use code ASHA50 to get 10% discount on orders above ৳299
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FiMessageSquare className="text-gray-400 w-5 h-5" />
                    </div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      className="pl-10 w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent text-base"
                      placeholder="Any special instructions for delivery"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#F3F9F1] rounded-lg p-4">
              <h2 className="font-semibold text-gray-800 mb-3 text-lg">Payment Method</h2>
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg border-2 border-[#2B7A0B]">
                <div className="w-12 h-12 flex items-center justify-center bg-[#2B7A0B] text-white rounded-full text-xl">
                  ৳
                </div>
                <div>
                  <p className="font-medium text-gray-800">Cash on Delivery</p>
                  <p className="text-gray-500">Pay when you receive your order</p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="sticky bottom-0 bg-white py-4 border-t">
              <div className="max-w-2xl mx-auto px-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2B7A0B] text-white py-4 rounded-full font-medium hover:bg-[#236209] transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <span className="font-medium">• ৳{getFinalTotal().toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 