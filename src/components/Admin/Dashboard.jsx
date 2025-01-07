import React, { useState, useEffect, useRef } from 'react';
import { FiTrendingUp, FiPackage, FiUsers, FiDollarSign, FiShoppingBag, FiBell } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    salesData: {
      labels: [],
      datasets: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for new orders in real-time
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      orderBy('orderDate', 'desc'),
      where('isRead', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = change.doc.data();
          const notification = {
            id: change.doc.id,
            type: 'new_order',
            title: 'New Order Received',
            message: `New order from ${order.delivery?.name}`,
            total: order.total,
            timestamp: order.orderDate,
            isRead: false,
            order: {
              id: change.doc.id,
              ...order
            }
          };

          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new orders
          toast.success('New order received!', {
            icon: '🛍️',
            duration: 5000,
          });
        }
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get last 7 days dates
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        // Initialize daily sales
        const dailySales = {};
        last7Days.forEach(date => dailySales[date] = 0);

        // Fetch orders
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        
        let totalSales = 0;
        let totalOrders = 0;
        const recentOrders = [];

        ordersSnapshot.forEach(doc => {
          const order = doc.data();
          totalOrders++;

          // Only count sales for delivered orders
          if (order.status === 'delivered') {
            totalSales += order.total || 0;

            // Add to daily sales if order is from last 7 days
            if (order.orderDate) {
              const orderDate = order.orderDate.toDate().toISOString().split('T')[0];
              if (dailySales.hasOwnProperty(orderDate)) {
                dailySales[orderDate] += order.total || 0;
              }
            }
          }

          // Add to recent orders
          if (recentOrders.length < 5) {
            recentOrders.push({
              id: doc.id,
              ...order,
              orderDate: order.orderDate?.toDate()
            });
          }
        });

        // Sort recent orders by date
        recentOrders.sort((a, b) => b.orderDate - a.orderDate);

        // Fetch total customers (users with role 'customer')
        const customersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'customer')
        );
        const customersSnapshot = await getDocs(customersQuery);
        const totalCustomers = customersSnapshot.size;

        // Fetch total products
        const productsQuery = query(collection(db, 'products'));
        const productsSnapshot = await getDocs(productsQuery);
        const totalProducts = productsSnapshot.size;

        // Prepare chart data
        const chartData = {
          labels: last7Days.map(date => {
            const [year, month, day] = date.split('-');
            return `${month}/${day}`;
          }),
          datasets: [
            {
              label: 'Daily Sales',
              data: Object.values(dailySales),
              borderColor: '#2C742F',
              backgroundColor: 'rgba(44, 116, 47, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        };

        setStats({
          totalSales,
          totalOrders,
          totalCustomers,
          totalProducts,
          recentOrders,
          salesData: chartData
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Handle notification action (e.g., navigate to order details)
    // You can add navigation logic here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Bell */}
      <div className="flex justify-end">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-100 relative"
          >
            <FiBell className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                            <FiPackage />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-sm font-medium text-primary mt-1">
                            ৳{notification.total?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.timestamp?.toDate().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                ৳{stats.totalSales.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">From delivered orders</p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.totalOrders.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">All time orders</p>
        </div>

        {/* Total Customers Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.totalCustomers.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Registered customers</p>
        </div>

        {/* Total Products Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.totalProducts.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
              <FiShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Available products</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Sales Overview</h3>
        <div className="h-[300px]">
          <Line
            data={stats.salesData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => '৳' + value.toLocaleString()
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: (context) => '৳' + context.raw.toLocaleString()
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.delivery?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderDate?.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ৳{order.total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 