import React from 'react';
import { FaShippingFast, FaLeaf } from 'react-icons/fa';
import { TbCertificate } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-neutral-50 to-white py-6 md:py-8 overflow-hidden">
      <div className="max-w-[1440px] mx-auto relative px-4">
        <div className="relative">
          {/* Platform Circles */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[1200px] h-[80px] md:h-[120px]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[40px] md:h-[60px] bg-gray-100 rounded-[100%]"></div>
            <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 w-[95%] h-[40px] md:h-[60px] bg-gray-200 rounded-[100%]"></div>
          </div>

          {/* Hero Image */}
          <div className="relative z-10">
            <div className="w-[95%] mx-auto h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg md:rounded-[2rem] overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1400&auto=format&fit=crop"
                alt="Organic Products Showcase"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'center 30%'
                }}
              />
              
              {/* Overlay with CTA */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white p-3 md:p-8">
                <h1 className="text-xl md:text-5xl font-bold text-center mb-2 md:mb-4">
                  Fresh & Organic
                </h1>
                <p className="text-xs md:text-xl text-center mb-4 md:mb-8 max-w-2xl px-4">
                  Discover nature's finest selection of organic products
                </p>
                <div className="flex flex-row gap-2 md:gap-6">
                  <button className="bg-[#2B7A0B] hover:bg-[#236209] text-white px-4 md:px-8 py-1.5 md:py-3 rounded-full text-sm md:text-base flex items-center justify-center gap-1 md:gap-2 transition-all duration-300 group">
                    Shop Now
                    <BsArrowRight className="text-sm md:text-base group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white hover:bg-gray-100 text-[#2B7A0B] px-4 md:px-8 py-1.5 md:py-3 rounded-full text-sm md:text-base transition-colors duration-300">
                    Categories
                  </button>
                </div>
              </div>
              
              {/* Trust Badges - Hidden on mobile */}
              <div className="absolute bottom-4 right-4 hidden md:flex flex-row gap-4">
                <div className="flex items-center gap-2 bg-[#2B7A0B] px-4 py-2 rounded-full shadow-md">
                  <FaLeaf className="text-white text-xl" />
                  <span className="text-sm font-medium text-white">100% Organic</span>
                </div>
                <div className="flex items-center gap-2 bg-[#2B7A0B] px-4 py-2 rounded-full shadow-md">
                  <TbCertificate className="text-white text-xl" />
                  <span className="text-sm font-medium text-white">Certified Products</span>
                </div>
                <div className="flex items-center gap-2 bg-[#2B7A0B] px-4 py-2 rounded-full shadow-md">
                  <FaShippingFast className="text-white text-xl" />
                  <span className="text-sm font-medium text-white">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 