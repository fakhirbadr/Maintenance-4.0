import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

// Importation des images
import slide_image_1 from "../../../public/images/IOT/swipper/1.jpg";
import slide_image_2 from "../../../public/images/IOT/swipper/2.jpg";
import slide_image_3 from "../../../public/images/IOT/swipper/3.jpg";
import slide_image_4 from "../../../public/images/IOT/swipper/4.jpeg";
import slide_image_5 from "../../../public/images/IOT/swipper/5.jpeg";

const SwiperImage = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 text-center">
      
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="h-96  w-full relative" // Ajustez la hauteur ici
      >
        <SwiperSlide className="flex justify-center items-center">
          <img
            src={slide_image_1}
            alt="Image 1"
            className="w-full h-auto rounded-lg object-cover"
          />
        </SwiperSlide>
        <SwiperSlide className="flex justify-center items-center">
          <img
            src={slide_image_2}
            alt="Image 2"
            className="w-full h-auto rounded-lg object-cover"
          />
        </SwiperSlide>
        <SwiperSlide className="flex justify-center items-center">
          <img
            src={slide_image_3}
            alt="Image 3"
            className="w-full h-auto rounded-lg object-cover"
          />
        </SwiperSlide>
        <SwiperSlide className="flex justify-center items-center">
          <img
            src={slide_image_4}
            alt="Image 4"
            className="w-full h-auto rounded-lg object-cover"
          />
        </SwiperSlide>
        <SwiperSlide className="flex justify-center items-center">
          <img
            src={slide_image_5}
            alt="Image 5"
            className="w-full h-auto rounded-lg object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SwiperImage;
