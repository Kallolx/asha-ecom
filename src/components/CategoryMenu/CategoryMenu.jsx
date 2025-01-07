import React, { useState } from 'react';
import { BiCategory } from 'react-icons/bi';
import { BsHeadset, BsEggFill } from 'react-icons/bs';
import { IoLeafOutline } from 'react-icons/io5';
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

const CategoryMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="border-b shadow-sm bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Browse Categories Button */}
          <div className="relative group">
            <button 
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-t hover:bg-primary-dark transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <BiCategory className="text-xl" />
              <span>All Categories</span>
              <IoLeafOutline 
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-white border rounded-b-lg shadow-lg py-2 z-50">
                {categories.map((category, index) => (
                  <div key={index} className="relative group/item">
                    <a
                      href="#"
                      className="flex items-center justify-between px-4 py-3 hover:bg-neutral-lightest transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <category.icon 
                          size={22} 
                          className={`${category.color} group-hover:scale-110 transition-transform`}
                        />
                        <span className="font-medium text-neutral-dark group-hover:text-primary transition-colors">
                          {category.name}
                        </span>
                      </div>
                      {category.subcategories && (
                        <IoLeafOutline 
                          className="text-neutral-400 group-hover:text-primary -rotate-90"
                          size={16}
                        />
                      )}
                    </a>
                    
                    {/* Subcategories */}
                    {category.subcategories && (
                      <div className="absolute left-full top-0 w-64 bg-white border rounded-lg shadow-lg py-2 hidden group-hover/item:block ml-1">
                        {category.subcategories.map((sub, subIndex) => (
                          <a
                            key={subIndex}
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-lightest transition-colors group"
                          >
                            <sub.icon 
                              size={20} 
                              className={`${sub.color} group-hover:scale-110 transition-transform`}
                            />
                            <span className="text-neutral-dark group-hover:text-primary transition-colors">
                              {sub.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Center Menu Items */}
          <div className="flex items-center gap-8">
            <a href="#" className="py-3 text-neutral-dark hover:text-primary transition-colors">All Products</a>
            <a href="#" className="py-3 text-neutral-dark hover:text-primary transition-colors">FAQ</a>
            <a href="#" className="py-3 text-neutral-dark hover:text-primary transition-colors">Contact</a>
            <a href="#" className="py-3 text-neutral-dark hover:text-primary transition-colors">Blogs</a>
          </div>

          {/* Customer Support */}
          <div className="flex items-center gap-2 text-neutral-dark">
            <BsHeadset className="text-2xl text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-medium text-primary">09678242404</span>
              <span className="text-xs text-neutral">7 Days customer support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu; 