import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { FaCarrot, FaAppleAlt, FaBreadSlice, FaLeaf, FaMugHot, FaEgg, FaChevronDown } from 'react-icons/fa';
import { GiHoneypot } from 'react-icons/gi';

const categories = [
  {
    name: 'Fresh Vegetables',
    icon: <FaCarrot className="text-[#2B7A0B]" />,
  },
  {
    name: 'Fresh Fruits',
    icon: <FaAppleAlt className="text-[#FF6B6B]" />,
  },
  {
    name: 'Bakery',
    icon: <FaBreadSlice className="text-[#FFB23F]" />,
  },
  {
    name: 'Dairy & Eggs',
    icon: <FaEgg className="text-[#4A90E2]" />,
  },
  {
    name: 'Honey',
    icon: <GiHoneypot className="text-[#D4A373]" />,
  },
  {
    name: 'Tea & Coffee',
    icon: <FaMugHot className="text-[#3A5A40]" />,
  },
  {
    name: 'Herbs',
    icon: <FaLeaf className="text-[#2D6A4F]" />,
  }
];

const MobileSidebar = ({ isOpen, onClose }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <div 
      className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button onClick={onClose} className="p-2">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            {/* Categories Dropdown */}
            <div className="px-4">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between w-full py-3 text-left"
              >
                <span className="text-gray-700 font-medium">Browse All</span>
                <FaChevronDown className={`transform transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Content */}
              <div className={`overflow-hidden transition-all duration-300 ${isCategoryOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="space-y-2 pl-2 pb-3">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 w-full py-2 px-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Links */}
            <div className="border-t mt-2">
              <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50">About Us</a>
              <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50">Order Tracking</a>
              <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50">Contact</a>
              <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar; 