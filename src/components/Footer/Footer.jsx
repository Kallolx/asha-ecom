import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiFacebook, FiInstagram } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#F3F9F1] text-gray-800 pt-8 md:pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile View Logo and Social */}
        <div className="md:hidden text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Ultimate Organic Life" 
            className="w-40 mx-auto mb-4"
          />
          <div className="flex justify-center items-center gap-6 mt-4">
            <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors p-2">
              <FiFacebook size={24} />
            </a>
            <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors p-2">
              <FiInstagram size={24} />
            </a>
            <a href="#" className="text-[#2B7A0B] hover:text-[#236209] transition-colors p-2">
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8">
          {/* Company Info - Hidden on Mobile */}
          <div className="hidden md:block space-y-4">
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
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-[#2B7A0B]">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                <FiMapPin className="text-[#2B7A0B] text-xl md:mt-1" />
                <p className="text-gray-600 text-sm">
                  Tengri, Madhupur,<br />
                  Tangail, Dhaka
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3">
                <FiPhone className="text-[#2B7A0B] text-xl" />
                <a href="tel:09678242404" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">
                  09678242404
                </a>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3">
                <FiMail className="text-[#2B7A0B] text-xl" />
                <a href="mailto:info@organiclife.com" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors">
                  info@organiclife.com
                </a>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                <FiClock className="text-[#2B7A0B] text-xl md:mt-1" />
                <div className="text-gray-600 text-sm">
                  <p>Mon - Sat: 8:00 AM - 10:00 PM</p>
                  <p>Sunday: 10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-[#2B7A0B]">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              <a href="#" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors py-1">About Us</a>
              <a href="#" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors py-1">Shop</a>
              <a href="#" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors py-1">Order Tracking</a>
              <a href="#" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors py-1">FAQs</a>
              <a href="#" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors py-1">Privacy Policy</a>
              <a href="#" className="text-gray-600 text-sm hover:text-[#2B7A0B] transition-colors py-1">Terms & Conditions</a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-[#2B7A0B]">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="space-y-3 max-w-xs mx-auto md:mx-0">
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

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-xs md:text-sm">
            © {new Date().getFullYear()} Ultimate Organic Life. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 