"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

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
  const [eventoAttivo, setEventoAttivo] = useState(false);

  useEffect(() => {
    fetch("/api/active-event")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEventoAttivo(true);
      })
      .catch((err) => console.error("Errore evento attivo:", err));
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[80vh] lg:h-[90vh]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center justify-center text-center">
              <Image src={slide.src} alt={slide.alt} fill className="object-cover" priority={index === 0} />
              <div className="absolute inset-0 bg-black/50" />
              {eventoAttivo && (
                <Link href="/lista" className="relative z-10 mt-6 px-6 py-3 bg-purple-600 text-white text-lg font-semibold rounded hover:bg-purple-800 transition">
                  Mettiti in lista
                </Link>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
