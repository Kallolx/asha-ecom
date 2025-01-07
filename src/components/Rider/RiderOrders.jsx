import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FiPackage, FiTruck, FiMapPin, FiPhone, FiCheck, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RiderOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('status', '==', 'processing')
      );
      const querySnapshot = await getDocs(q);
      
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryComplete = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'delivered',
        deliveredAt: new Date().toISOString()
      });
      
      // Update local state
      setOrders(orders.filter(order => order.id !== orderId));
      
      toast.success('Order marked as delivered successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders for Delivery</h2>
        <p className="mt-1 text-sm text-gray-500">
          Orders ready for delivery assigned by admin
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders available</h3>
          <p className="mt-1 text-sm text-gray-500">Check back later for new delivery assignments.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                  </h3>
                  <span className="inline-flex mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Ready for delivery
                  </span>
                </div>
                <p className="text-lg font-semibold text-primary">
                  ৳{order.total?.toLocaleString()}
                </p>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-gray-700">Order Items:</p>
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.package?.name} • {item.quantity} {item.quantity > 1 ? 'items' : 'item'}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 font-medium">
                    {order.delivery?.name}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                  <a href={`tel:${order.delivery?.phone}`} className="text-primary hover:text-primary-dark">
                    {order.delivery?.phone}
                  </a>
                </div>
                <div className="flex items-start text-sm">
                  <FiMapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                  <span className="text-gray-600">{order.delivery?.address}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={() => handleDeliveryComplete(order.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <FiCheck /> Mark as Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiderOrders; 