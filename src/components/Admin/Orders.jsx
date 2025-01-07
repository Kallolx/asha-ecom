import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FiPackage, FiClock, FiCheck, FiX, FiTruck, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const { userRole } = useAuth();

  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('orderDate', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          orderDate: data.orderDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (userRole !== 'admin') {
      toast.error('You do not have permission to update order status');
      return;
    }

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: userRole,
        isRead: true
      });
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please check your permissions.');
    }
  };

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
      case 'cancelled':
        return <FiX className="text-red-500" />;
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
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all customer orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center gap-4">
            <select
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.delivery?.name}</div>
                    <div className="text-sm text-gray-500">{order.delivery?.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items?.map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.name} ({item.package.name}) x {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderDate instanceof Date 
                      ? order.orderDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Invalid Date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {userRole === 'admin' ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ৳{order.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary hover:text-primary-dark inline-flex items-center gap-1"
                    >
                      <FiEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Order Details</h3>
                  <p className="text-sm text-gray-500">#{selectedOrder.orderNumber || selectedOrder.id.slice(-6).toUpperCase()}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedOrder.delivery?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.delivery?.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{selectedOrder.delivery?.address}</p>
                  </div>
                  {selectedOrder.delivery?.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium">{selectedOrder.delivery.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-gray-500">
                          {item.package.name} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>৳{selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600">-৳{selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-medium text-base pt-2 border-t">
                    <span>Total</span>
                    <span>৳{selectedOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              {userRole === 'admin' && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order Status</h4>
                      <p className="text-sm text-gray-500">Update the current status of this order</p>
                    </div>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 