import React, { useState } from 'react';
import { FiX, FiSearch, FiPackage, FiClock, FiCheck, FiTruck } from 'react-icons/fi';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const OrderTracking = ({ isOpen, onClose }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiPackage className="text-blue-500" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheck className="text-green-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error('Please enter an order number');
      return;
    }

    setLoading(true);
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('orderNumber', '==', orderNumber.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error('Order not found');
        setOrder(null);
      } else {
        const orderData = querySnapshot.docs[0].data();
        setOrder({
          id: querySnapshot.docs[0].id,
          ...orderData,
          orderDate: orderData.orderDate?.toDate()
        });
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Track Order</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleTrackOrder} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                ) : (
                  <FiSearch size={20} />
                )}
              </button>
            </div>
          </form>

          {order && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {order.orderDate?.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-medium">Order Status</p>
                    <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Delivery Details</p>
                <div className="text-sm text-gray-600">
                  <p>Name: {order.delivery?.name}</p>
                  <p>Phone: {order.delivery?.phone}</p>
                  <p>Address: {order.delivery?.address}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Order Summary</p>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} ({item.package.name} x {item.quantity})</span>
                      <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>৳{order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 