import React, { useState, useRef, useEffect } from 'react';
import { FiShoppingCart, FiPhone, FiMenu, FiUser, FiLogOut, FiPackage, FiSettings, FiHeart } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { AiOutlineHeart } from 'react-icons/ai';
import { MdOutlineLocalShipping } from 'react-icons/md';
import MobileSidebar from '../MobileSidebar/MobileSidebar';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartModal from '../Cart/CartModal';
import AuthModal from '../Auth/AuthModal';
import { Link } from 'react-router-dom';
import OrderTracking from '../Order/OrderTracking';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { getCartCount } = useCart();
  const { user, logOut } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="font-poppins w-full">
        {/* Top Navbar */}
        <div className="bg-primary text-white py-2 w-full">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-secondary-light cursor-pointer flex items-center gap-1"
                >
                  <MdOutlineLocalShipping className="text-lg" />
                  <span className="text-sm">Order Tracking</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-secondary-light" />
                <span className="text-secondary-light font-medium">01831-624571</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="py-4 shadow-sm w-full bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between gap-4 md:gap-8">
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-neutral-dark"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <FiMenu size={24} />
              </button>

              {/* Logo */}
              <div className="w-32 md:w-48">
                <Link to="/">
                  <img src="/logo.png" alt="Ultimate Organic Life" className="w-full" />
                </Link>
              </div>

              {/* Search Bar - Hidden on Mobile */}
              <div className="hidden md:flex flex-1">
                <div className="relative flex-1">
                  <div className="flex">
                    <button className="px-4 py-2 bg-neutral-light border border-r-0 border-gray-300 rounded-l-full text-neutral-dark hover:bg-neutral-lightest flex items-center gap-2">
                      All Categories
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search for items..."
                        className="w-full py-2 px-4 border border-gray-300 focus:outline-none focus:border-primary"
                      />
                      <button className="absolute right-0 top-0 h-full px-6 bg-primary hover:bg-primary-dark rounded-r-full transition-colors">
                        <BiSearch className="text-white text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="relative">
                    <AiOutlineHeart className="text-xl md:text-2xl text-neutral group-hover:text-primary transition-colors" />
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
                  </div>
                  <span className="text-[10px] md:text-xs mt-1">Wishlist</span>
                </div>
                <div 
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setIsCartOpen(true)}
                >
                  <div className="relative">
                    <FiShoppingCart className="text-xl md:text-2xl text-neutral group-hover:text-primary transition-colors" />
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs mt-1">Cart</span>
                </div>

                {/* Account Section */}
                {user ? (
                  <div className="hidden md:flex flex-col items-center cursor-pointer group relative" ref={userMenuRef}>
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-sm font-medium">
                            {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        
                        <div className="py-1">
                          <a href="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <FiUser className="text-gray-400" />
                            My Account
                          </a>
                          <a href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <FiPackage className="text-gray-400" />
                            My Orders
                          </a>
                          <a href="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <FiHeart className="text-gray-400" />
                            Wishlist
                          </a>
                          <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <FiSettings className="text-gray-400" />
                            Settings
                          </a>
                        </div>
                        
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            <FiLogOut className="text-red-400" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="hidden md:flex flex-col items-center cursor-pointer group"
                    onClick={() => setIsAuthOpen(true)}
                  >
                    <FiUser className="text-xl md:text-2xl text-neutral group-hover:text-primary transition-colors" />
                    <span className="text-[10px] md:text-xs mt-1">Account</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search - Visible only on mobile */}
            <div className="mt-4 md:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for items..."
                  className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <button className="absolute right-0 top-0 h-full px-6 bg-primary hover:bg-primary-dark rounded-r-full transition-colors">
                  <BiSearch className="text-white text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <MobileSidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </header>

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Order Tracking Modal */}
      <OrderTracking
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </>
  );
};

export default Navbar; 