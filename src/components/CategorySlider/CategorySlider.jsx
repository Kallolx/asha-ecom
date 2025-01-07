import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

const categoryMappings = {
  'fresh-farm': {
    name: 'Fresh Farm',
    icon: '/icons/fresh.png',
  },
  'bakery': {
    name: 'Bakery',
    icon: '/icons/bakery.png',
  },
  'other-products': {
    name: 'Others',
    icon: '/icons/other.png',
  },
  'seasonal-products': {
    name: 'Seasonal',
    icon: '/icons/seasonal.png',
  },
  'special-products': {
    name: 'Special',
    icon: '/icons/special.png',
  }
};

const categories = Object.entries(categoryMappings).map(([id, data]) => ({
  id,
  ...data
}));

const CategorySlider = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

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
          {categories.map((category) => (
            <SwiperSlide key={category.id} className="!w-[160px] md:!w-auto">
              <div 
                onClick={() => handleCategoryClick(category.id)}
                className="bg-[#F3F9F1] rounded-xl p-6 md:p-8 h-[180px] md:h-[220px] flex flex-col items-center justify-center group cursor-pointer hover:bg-[#E7F3E5] transition-colors duration-300"
              >
                {/* Icon Container */}
                <div className="w-16 h-16 md:w-24 md:h-24 mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  <img 
                    src={category.icon} 
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <h3 className="text-[#2B7A0B] font-bold text-base md:text-xl">
                    {category.name}
                  </h3>
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