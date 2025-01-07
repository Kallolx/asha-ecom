import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#F3F9F1] text-gray-800 pt-6 md:pt-12 pb-4 md:pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile View - Simplified */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-6">
            <img 
              src="/logo.png" 
              alt="Ultimate Organic Life" 
              className="w-32"
            />
            <div className="flex items-center gap-4">
              <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Contact Info - Mobile */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiPhone className="text-[#2B7A0B] text-lg" />
                <a href="tel:09678242404" className="text-sm text-gray-600">
                  09678242404
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="text-[#2B7A0B] text-lg" />
                <a href="mailto:info@organiclife.com" className="text-sm text-gray-600">
                  info@organiclife.com
                </a>
              </div>
            </div>

            {/* Quick Links - Mobile */}
            <div className="text-right">
              <a href="#" className="block text-sm text-gray-600 mb-2">About Us</a>
              <a href="#" className="block text-sm text-gray-600 mb-2">Shop</a>
              <a href="#" className="block text-sm text-gray-600">FAQs</a>
            </div>
          </div>
        </div>

        {/* Desktop View - Full Content */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src="/logo.png" 
              alt="Ultimate Organic Life" 
              className="w-48 mb-4"
            />
            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted source for fresh, organic products delivered right to your doorstep.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#2B7A0B]">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-[#2B7A0B] text-xl mt-1" />
                <p className="text-gray-600 text-sm">
                  Tengri, Madhupur,<br />
                  Tangail, Dhaka
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-[#2B7A0B] text-xl" />
                <a href="tel:09678242404" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">
                  09678242404
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-[#2B7A0B] text-xl" />
                <a href="mailto:info@organiclife.com" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">
                  info@organiclife.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#2B7A0B]">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">About Us</a>
              <a href="#" className="block text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">Shop</a>
              <a href="#" className="block text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">Order Tracking</a>
              <a href="#" className="block text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">FAQs</a>
              <a href="#" className="block text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">Terms & Conditions</a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#2B7A0B]">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent"
              />
              <button 
                type="submit"
                className="w-full px-6 py-2.5 bg-[#2B7A0B] text-white rounded-full font-medium hover:bg-[#236209] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright - Both Mobile & Desktop */}
        <div className="pt-4 mt-4 md:pt-8 md:mt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Ultimate Organic Life. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 