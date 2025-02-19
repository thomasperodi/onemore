"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Event {
  nome: string;
  data: string;
  locandina: string;
  orario_chiusura: string;
  attivo: boolean;
  link?: string;
}



const PastEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/PastEvents"); // Modifica con il tuo endpoint API
        if (!response.ok) {
          throw new Error("Errore nel recupero degli eventi");
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="events" className="p-8 bg-white text-center">
      <h2 className="text-3xl font-bold mb-6">Eventi Passati</h2>
  
      {loading ? (
        <p className="text-center">Caricamento eventi...</p>
      ) : events.length === 0 ? (
        <p className="text-center">Nessun evento passato disponibile.</p>
      ) : (
        <Slider {...settings}>
          {events.map((event, index) => (
        <div key={index} className="px-2">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-[400px] w-full">
          
            <div className="relative w-full aspect-square"> {/* Mantiene proporzioni 1:1 */}
              {event.locandina ? (
                <Image
                  src={event.locandina}
                  alt={event.nome}
                  layout="fill"
                  objectFit="cover"
                  className="object-cover hover:opacity-80 transition"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">Immagine non disponibile</span>
                </div>
              )}
            </div>
          
          <div className="p-6 flex flex-col justify-between h-full">
            <div>
              <div className="text-sm text-gray-500">
                {new Date(event.data).toLocaleDateString()}
              </div>
              <h3 className="text-xl font-bold mt-4">{event.nome}</h3>
            </div>
            {/* <div className="mt-4">
              {event.link ? (
                <Link href={event.link}>
                  <button className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition">
                    Acquista
                  </button>
                </Link>
              ) : (
                <button
                  className="w-full py-3 bg-gray-400 text-white font-bold rounded-lg cursor-not-allowed"
                  disabled
                >
                  Non disponibile
                </button>
              )}
            </div> */}
          </div>
        </div>
      </div>
      
       
        
          
          ))}
        </Slider>
      )}
    </section>
  );
};

export default PastEvents;
