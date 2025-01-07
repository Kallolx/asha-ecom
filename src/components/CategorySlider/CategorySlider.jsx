import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaCarrot, FaBreadSlice, FaGift } from 'react-icons/fa';
import { GiHoneypot } from 'react-icons/gi';
import { MdOutlineWbSunny } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

const categories = [
  {
    name: 'Fresh Farm',
    icon: <FaCarrot />,
    textColor: 'text-[#2B7A0B]',
    count: '150+ Items'
  },
  {
    name: 'Bakery',
    icon: <FaBreadSlice />,
    textColor: 'text-[#2B7A0B]',
    count: '80+ Items'
  },
  {
    name: 'Other Products',
    icon: <GiHoneypot />,
    textColor: 'text-[#2B7A0B]',
    count: '25+ Items'
  },
  {
    name: 'Seasonal Products',
    icon: <MdOutlineWbSunny />,
    textColor: 'text-[#2B7A0B]',
    count: '45+ Items'
  },
  {
    name: 'Special Products',
    icon: <FaGift />,
    textColor: 'text-[#2B7A0B]',
    count: '30+ Items'
  }
];

const CategorySlider = () => {
  return (
    <div className="py-8 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 text-gray-800">Shop By Category</h2>
          <p className="text-gray-600 md:text-lg">Explore our wide range of organic products</p>
        </div>
        
        <Swiper
          slidesPerView="auto"
          spaceBetween={16}
          freeMode={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full pb-12"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index} className="!w-[160px] md:!w-auto">
              <div className="bg-[#F3F9F1] rounded-xl p-6 md:p-8 h-[180px] md:h-[220px] flex flex-col items-center justify-center group cursor-pointer hover:bg-[#E7F3E5] transition-colors duration-300">
                {/* Icon Container */}
                <div className={`${category.textColor} text-4xl md:text-5xl mb-6 transform transition-transform duration-300 group-hover:scale-110`}>
                  {category.icon}
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <h3 className={`${category.textColor} font-bold text-base md:text-xl mb-2`}>
                    {category.name}
                  </h3>
                  <span className="text-[#2B7A0B]/70 text-xs md:text-sm">
                    {category.count}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySlider; 