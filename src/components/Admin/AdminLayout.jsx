import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiGrid, FiPackage, FiUsers, FiShoppingBag, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FiGrid, label: 'Dashboard' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { path: '/admin/products', icon: FiPackage, label: 'Products' },
    { path: '/admin/customers', icon: FiUsers, label: 'Customers' },
    { path: '/admin/delivery-riders', icon: FiTruck, label: 'Delivery Riders' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 bg-white border-r border-gray-200 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link to="/admin" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              <span className="font-semibold text-lg">Admin Panel</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : 'text-gray-400'}`} />
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-lg font-medium">
                    {user?.displayName ? user.displayName[0].toUpperCase() : 'A'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.displayName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="bg-white border-b h-16 fixed top-0 right-0 left-0 z-30 md:left-64">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Welcome back, {user?.displayName?.split(' ')[0] || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 