import React, { useEffect, useState } from 'react';
import { FiPrinter, FiPackage, FiClock, FiMapPin, FiCopy, FiCheck } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const OrderSuccess = ({ order, onClose }) => {
  const { items, delivery, orderNumber, orderDate, subtotal, discount = 0, total } = order;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2B7A0B', '#4CAF50'],
    });
  }, []);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success('Order number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Success Header */}
      <div className="bg-[#2B7A0B] text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
            <svg 
              className="w-12 h-12 text-[#2B7A0B]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Thank You for Your Order!
          </h1>
          <p className="opacity-90 text-lg mb-6">
            Your order has been placed successfully
          </p>

          {/* Order Number with Copy */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-sm text-white/80 mb-1">Order Number</p>
            <div className="flex items-center justify-center gap-2">
              <p className="font-mono text-xl font-bold">{orderNumber}</p>
              <button
                onClick={handleCopyOrderNumber}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Copy order number"
              >
                {copied ? (
                  <FiCheck className="w-5 h-5 text-green-300" />
                ) : (
                  <FiCopy className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-white/60 mt-1">
              {new Date(orderDate).toLocaleDateString()} • {new Date(orderDate).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Order Status */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#2B7A0B] text-white rounded-full">
              <FiClock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-yellow-800">Order Processing</p>
              <p className="text-sm text-yellow-700">Estimated delivery time: 2-3 hours</p>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-[#2B7A0B] w-5 h-5" />
              <h2 className="font-semibold text-gray-800">Delivery Details</h2>
            </div>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> {delivery.name}</p>
            <p><span className="text-gray-500">Phone:</span> {delivery.phone}</p>
            <p><span className="text-gray-500">Address:</span> {delivery.address}</p>
            {delivery.notes && (
              <p><span className="text-gray-500">Notes:</span> {delivery.notes}</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <FiPackage className="text-[#2B7A0B] w-5 h-5" />
              <h2 className="font-semibold text-gray-800">Order Summary</h2>
            </div>
          </div>
          <div className="divide-y">
            {items.map((item) => (
              <div key={`${item.id}-${item.package.id}`} className="flex items-center gap-4 p-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.package.name} x {item.quantity}</p>
                </div>
                <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="text-[#2B7A0B]">Free</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="text-[#2B7A0B]">-৳{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total Amount</span>
              <span className="text-[#2B7A0B]">৳{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 text-[#2B7A0B] hover:text-[#236209] transition-colors border-2 border-current px-6 py-3 rounded-full flex-1"
          >
            <FiPrinter className="w-5 h-5" />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="bg-[#2B7A0B] text-white px-6 py-3 rounded-full hover:bg-[#236209] transition-colors flex-1"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 