import React, { useState } from 'react';
import { FiX, FiUser, FiLogOut, FiPackage, FiSettings, FiHeart, FiChevronDown } from 'react-icons/fi';
import { PiPlantFill } from 'react-icons/pi';
import { IoLeafOutline } from 'react-icons/io5';
import { BiCategory } from 'react-icons/bi';
import { BsEggFill } from 'react-icons/bs';
import { 
  FaStore, 
  FaBreadSlice, 
  FaCookie, 
  FaCheese, 
  FaWineGlass,
  FaBirthdayCake
} from 'react-icons/fa';
import { HiOutlineBuildingStorefront } from 'react-icons/hi2';
import { TbMilk } from 'react-icons/tb';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../Auth/AuthModal';

// Categories data
const categories = [
  {
    name: 'Fresh Farm',
    icon: HiOutlineBuildingStorefront,
    color: 'text-green-600',
    subcategories: [
      { name: 'Fresh Milk', icon: TbMilk, color: 'text-blue-400' },
      { name: 'Farm Fresh Eggs', icon: BsEggFill, color: 'text-yellow-500' },
    ]
  },
  {
    name: 'Bakery',
    icon: FaStore,
    color: 'text-amber-600',
    subcategories: [
      { name: 'Fresh Breads', icon: FaBreadSlice, color: 'text-amber-700' },
      { name: 'Toast & Buns', icon: FaBreadSlice, color: 'text-amber-500' },
      { name: 'Cakes', icon: FaBirthdayCake, color: 'text-pink-400' },
      { name: 'Cookies & Biscuits', icon: FaCookie, color: 'text-amber-400' },
    ]
  },
  {
    name: 'Other Products',
    icon: FaStore,
    color: 'text-neutral-600',
    subcategories: [
      { name: 'Chocolates', icon: FaCookie, color: 'text-brown-600' },
      { name: 'Cheese', icon: FaCheese, color: 'text-yellow-400' },
      { name: 'Beverages', icon: FaWineGlass, color: 'text-blue-500' },
    ]
  }
];

const MobileSidebar = ({ isOpen, onClose }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, logOut } = useAuth();

  const handleCategoryClick = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleSubcategoryClick = (category, subcategory) => {
    window.location.href = `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`;
    onClose();
  };

  const handleCategoryLinkClick = (category) => {
    window.location.href = `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`;
    onClose();
  };

  const handleAuthClick = () => {
    onClose();
    setIsAuthOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-[280px] bg-white transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="w-32">
              <img src="/logo.png" alt="Logo" className="w-full" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-lightest rounded-full">
              <FiX size={24} className="text-neutral-dark" />
            </button>
          </div>

          {/* User Info Section */}
          <div className="p-4 border-b">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-lg font-medium">
                      {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <span className="font-medium text-neutral-dark">
                  {user.displayName || 'User'}
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 text-neutral-dark hover:text-primary transition-colors cursor-pointer"
                onClick={handleAuthClick}
              >
                <FiUser size={20} />
                <span>Sign In / Register</span>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {/* Browse All Categories */}
              <div>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center justify-between w-full py-3 px-4 text-neutral-dark hover:bg-neutral-lightest rounded-lg group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BiCategory size={22} className="text-primary" />
                    <span className="font-medium group-hover:text-primary transition-colors">All Categories</span>
                  </div>
                  <FiChevronDown 
                    size={20} 
                    className={`text-neutral group-hover:text-primary transition-all duration-300 transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Categories Dropdown */}
                {isCategoryOpen && (
                  <div className="mt-2 bg-neutral-lightest rounded-lg overflow-hidden">
                    {categories.map((category, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between w-full">
                          <button
                            onClick={() => handleCategoryLinkClick(category)}
                            className="flex-1 flex items-center gap-3 py-3 px-4 hover:bg-neutral-light/50 transition-colors text-left"
                          >
                            <category.icon size={20} className={category.color} />
                            <span className="text-neutral-dark">{category.name}</span>
                          </button>
                          {category.subcategories && (
                            <button
                              onClick={() => handleCategoryClick(index)}
                              className="py-3 px-4 hover:bg-neutral-light/50 transition-colors"
                            >
                              <IoLeafOutline 
                                size={16}
                                className={`text-neutral-400 transition-transform duration-300 ${
                                  expandedCategory === index ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Subcategories */}
                        {expandedCategory === index && category.subcategories && (
                          <div className="bg-white">
                            {category.subcategories.map((sub, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={() => handleSubcategoryClick(category, sub)}
                                className="flex items-center gap-3 w-full py-2.5 px-8 hover:bg-neutral-lightest transition-colors text-left"
                              >
                                <sub.icon size={18} className={sub.color} />
                                <span className="text-neutral-dark hover:text-primary transition-colors">
                                  {sub.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Account Links - Only show if logged in */}
              {user && (
                <div className="mt-4 border-t pt-4">
                  <a href="/account" className="flex items-center gap-3 py-3 px-4 text-neutral-dark hover:bg-neutral-lightest rounded-lg group">
                    <FiUser size={20} className="text-neutral group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors">My Account</span>
                  </a>
                  <a href="/orders" className="flex items-center gap-3 py-3 px-4 text-neutral-dark hover:bg-neutral-lightest rounded-lg group">
                    <FiPackage size={20} className="text-neutral group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors">My Orders</span>
                  </a>
                  <a href="/wishlist" className="flex items-center gap-3 py-3 px-4 text-neutral-dark hover:bg-neutral-lightest rounded-lg group">
                    <FiHeart size={20} className="text-neutral group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors">Wishlist</span>
                  </a>
                  <a href="/settings" className="flex items-center gap-3 py-3 px-4 text-neutral-dark hover:bg-neutral-lightest rounded-lg group">
                    <FiSettings size={20} className="text-neutral group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors">Settings</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button - Only show if logged in */}
          {user && (
            <div className="mt-auto border-t p-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};

export default MobileSidebar; 