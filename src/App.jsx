import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CategoryMenu from './components/CategoryMenu/CategoryMenu';
import Hero from './components/Hero/Hero';
import CategorySlider from './components/CategorySlider/CategorySlider';
import PopularProducts from './components/PopularProducts/PopularProducts';
import TeamMembers from './components/TeamMembers/TeamMembers';
import Footer from './components/Footer/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import AdminLayout from './components/Admin/AdminLayout';
import Orders from './components/Admin/Orders';
import Products from './components/Admin/Products';
import Dashboard from './components/Admin/Dashboard';
import Customers from './components/Admin/Customers';
import DeliveryRiders from './components/Admin/DeliveryRiders';
import CategoryProducts from './components/CategoryProducts/CategoryProducts';
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';
import { FiPackage, FiClock, FiCheck, FiX, FiTruck } from 'react-icons/fi';
import RiderGuard from './components/Rider/RiderGuard';
import RiderLayout from './components/Rider/RiderLayout';
import RiderOrders from './components/Rider/RiderOrders';
import ProductDetail from './pages/ProductDetail';
import ScrollToTop from './components/ScrollToTop';

// Home page component
const Home = () => (
  <>
    <div className="hidden md:block">
      <CategoryMenu />
    </div>
    <Hero />
    <CategorySlider />
    <PopularProducts />
    <TeamMembers />
  </>
);

// Placeholder components for user account pages
const UserAccount = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">My Account</h1>
    <p>Account management features coming soon...</p>
  </div>
);

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'processing':
        return <FiTruck className="w-4 h-4" />;
      case 'delivered':
        return <FiCheck className="w-4 h-4" />;
      case 'cancelled':
        return <FiX className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate?.toDate()
        }));
        
        // Sort orders by date in JavaScript
        ordersData.sort((a, b) => b.orderDate - a.orderDate);
        
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Please sign in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#2B7A0B] hover:bg-[#236209]"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Order Header */}
            <div className="border-b border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-mono font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {order.orderDate?.toLocaleDateString()} • {order.orderDate?.toLocaleTimeString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.package.id}`} className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.package.name} x {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>৳{order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-[#2B7A0B]">-৳{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="text-[#2B7A0B]">Free</span>
                  </div>
                  <div className="flex justify-between font-medium text-base pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[#2B7A0B]">৳{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Delivery Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">{order.delivery.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{order.delivery.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-500">Address</p>
                      <p className="font-medium">{order.delivery.address}</p>
                    </div>
                    {order.delivery.notes && (
                      <div className="sm:col-span-2">
                        <p className="text-gray-500">Notes</p>
                        <p className="font-medium">{order.delivery.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserWishlist = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
    <p>Wishlist items coming soon...</p>
  </div>
);

const UserSettings = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <p>Account settings coming soon...</p>
  </div>
);

// Layout wrapper for pages with navbar and footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// Admin Guard Component
const AdminGuard = ({ children }) => {
  const { user, userRole } = useAuth();
  
  if (!user) {
    toast.error('Please sign in to access the admin panel');
    return <Navigate to="/" replace />;
  }
  
  if (userRole !== 'admin') {
    toast.error('You do not have permission to access the admin panel');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/category/:id" element={<MainLayout><CategoryProducts /></MainLayout>} />
            <Route path="/product/:productId" element={<MainLayout><ProductDetail /></MainLayout>} />
            
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="delivery-riders" element={<DeliveryRiders />} />
            </Route>

            {/* User Account Routes */}
            <Route path="/account" element={<MainLayout><UserAccount /></MainLayout>} />
            <Route path="/orders" element={<MainLayout><UserOrders /></MainLayout>} />
            <Route path="/wishlist" element={<MainLayout><UserWishlist /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><UserSettings /></MainLayout>} />
            
            {/* Rider Routes */}
            <Route path="/rider" element={
              <RiderGuard>
                <RiderLayout />
              </RiderGuard>
            }>
              <Route index element={<RiderOrders />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App; 