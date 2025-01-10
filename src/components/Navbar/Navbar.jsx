import React, { useState, useRef, useEffect } from 'react';
import { FiShoppingCart, FiPhone, FiMenu, FiUser, FiLogOut, FiPackage, FiSettings, FiMessageCircle } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
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
  const [isQuickContactOpen, setIsQuickContactOpen] = useState(false);
  const userMenuRef = useRef(null);
  const quickContactRef = useRef(null);
  const { getCartCount } = useCart();
  const { user, logOut } = useAuth();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (quickContactRef.current && !quickContactRef.current.contains(event.target)) {
        setIsQuickContactOpen(false);
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
                {/* Quick Chat/Contact Button */}
                <div className="relative" ref={quickContactRef}>
                  <button
                    onClick={() => setIsQuickContactOpen(!isQuickContactOpen)}
                    className="w-12 flex flex-col items-center"
                  >
                    <FiMessageCircle size={24} className="text-neutral group-hover:text-primary transition-colors mb-1" />
                    <span className="text-[10px]">Contact</span>
                  </button>

                  {/* Quick Contact Dropdown */}
                  {isQuickContactOpen && (
                    <div className="absolute top-[calc(100%+1rem)] right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-3 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Quick Contact</p>
                        <p className="text-xs text-gray-500">We're here to help!</p>
                      </div>
                      
                      <div className="py-2">
                        <a 
                          href="tel:01831-624571" 
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiPhone className="text-[#2B7A0B]" />
                          <div>
                            <p className="font-medium">Call Us</p>
                            <p className="text-xs text-gray-500">01831-624571</p>
                          </div>
                        </a>
                        
                        <a 
                          href="https://wa.me/+8801831624571" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.994 9.994 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.988-9.984 0-2.669-1.037-5.176-2.922-7.062A9.935 9.935 0 0012.012 2zm-3.97 14.256l-2.345-.673 2.325-3.81 2.345.673-2.325 3.81zm9.924-4.27c-.215.335-1.33.81-1.874.922-.543.112-1.235.155-1.993-.155-.758-.31-1.484-.758-2.294-1.568s-1.257-1.536-1.567-2.294c-.31-.758-.268-1.45-.156-1.993.112-.543.587-1.659.922-1.874.335-.215.71-.129.963.039.254.168.547.465.797.715.25.25.504.543.672.797.168.254.254.63.039.964-.215.335-.672.923-.672.923s.168.758.923 1.513c.755.755 1.513.923 1.513.923s.587-.458.922-.673c.335-.215.71-.129.964.039.254.168.547.465.797.715.25.25.504.543.672.797.168.254.174.63-.041.964z"/>
                          </svg>
                          <div>
                            <p className="font-medium">WhatsApp</p>
                            <p className="text-xs text-gray-500">Chat with us</p>
                          </div>
                        </a>

                        <a 
                          href="https://m.me/your.facebook.page" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4 text-[#0084FF]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.686 7.205V22l3.371-1.85c.93.258 1.914.397 2.943.397 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm1.09 12.409l-2.52-2.688-4.92 2.688 5.4-5.744 2.58 2.688 4.86-2.688-5.4 5.744z"/>
                          </svg>
                          <div>
                            <p className="font-medium">Messenger</p>
                            <p className="text-xs text-gray-500">Chat on Facebook</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Button */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  data-cart-trigger
                  className="w-12 flex flex-col items-center"
                >
                  <div className="relative mb-1">
                    <FiShoppingCart size={24} className="text-neutral group-hover:text-primary transition-colors" />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#FF8A00] text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                        {getCartCount()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px]">Cart</span>
                </button>

                {/* Account Section */}
                {user ? (
                  <div className="hidden md:block relative w-12" ref={userMenuRef}>
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-full flex flex-col items-center"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mb-1">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-xs font-medium">
                            {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px]">Account</span>
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
                  <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="hidden md:flex w-12 flex-col items-center"
                  >
                    <FiUser size={24} className="text-neutral group-hover:text-primary transition-colors mb-1" />
                    <span className="text-[10px]">Account</span>
                  </button>
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