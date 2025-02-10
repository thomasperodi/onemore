"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  { src: "/images/BelloFigo.jpg", alt: "Bello Figo" },
  { src: "/images/CamillaMasato.jpg", alt: "Camilla Masato" },
  { src: "/images/Fubbe_Mura.jpg", alt: "Fubbe e Mura" },
  { src: "/images/Fubbe.jpg", alt: "Fubbe" },
  { src: "/images/IMisterDiZona.jpg", alt: "I mister di zona" },
  { src: "/images/IrisDiDomenico.jpg", alt: "Iris Di Domenico" },
  { src: "/images/IrisDiDomenico2.jpg", alt: "Iris Di Domenico" },
  { src: "/images/LisaLuchetta.jpg", alt: "Lisa Luchetta" },
  { src: "/images/MatteoRobert.jpg", alt: "Matteo Robert" },
  { src: "/images/MVDM.jpg", alt: "MVDM" },
  { src: "/images/Pucho.jpg", alt: "Pucho" },
];

const Hero = () => {
  return (
    <section className="relative w-full h-[500px] md:h-[80vh] lg:h-[90vh]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[500px] md:h-[80vh] lg:h-[90vh] flex flex-col items-center justify-center text-center">
              {/* Background Image */}
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover"
              />

              {/* Overlay per migliorare la leggibilità */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Bottone per la lista */}
              <div className="relative z-10">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const listaSection = document.getElementById("lista");
                  if (listaSection) {
                    listaSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="mt-6 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded hover:bg-red-600 transition inline-block"
              >
                Inserisciti in lista
              </a>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
