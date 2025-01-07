import React, { useState } from 'react';
import { FaShippingFast, FaLeaf } from 'react-icons/fa';
import { TbCertificate } from 'react-icons/tb';
import { useSwipeable } from 'react-swipeable';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    "/ban1.jpg",
    "/ban2.jpg"  // Add your second image path here
  ];

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1)),
    onSwipedRight: () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

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
              {/* Swipeable container */}
              <div {...handlers} className="w-full h-full relative touch-pan-y">
                <div 
                  className="flex transition-transform duration-300 ease-out h-full"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {images.map((img, index) => (
                    <img 
                      key={index}
                      src={img}
                      alt={`Organic Products Showcase ${index + 1}`}
                      className="w-full h-full object-cover flex-shrink-0"
                      style={{
                        objectPosition: 'center 30%'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
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