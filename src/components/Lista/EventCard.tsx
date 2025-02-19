"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import EventForm from "./EventForm";

interface Event {
  id: number;
  locandina: string;
  nome: string;
  data: string;
}

const EventCard = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        const response = await fetch("/api/active-event");
        const data = await response.json();

        if (data && data.length > 0) {
          const evento = data[0];
          setEvent(evento);
          startCountdown(evento.data);

          // Memorizza l'ID dell'evento in localStorage
          localStorage.setItem("eventId", String(evento.id));
        }
      } catch (error) {
        console.error("Errore nel recupero dell'evento attivo:", error);
      }
    };

    fetchActiveEvent();
  }, []);

  const startCountdown = (targetTime: string) => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const distance = target - now;

      if (distance <= 0) {
        clearInterval(interval);
        setCountdown("L'evento è iniziato");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days}g ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
  };

  if (!event) {
    return <p className="text-white">Caricamento evento in corso...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-black rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[90vh]">
      <div className="w-full h-[500px] md:w-2/5 md:h-auto">
        <Image
          src={event.locandina}
          alt={event.nome}
          width={600}
          height={900}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 p-6 text-white flex flex-col justify-center space-y-6">
        <h1 className="text-4xl font-extrabold mb-4 text-pink-500 text-center md:text-left">
          {event.nome}
        </h1>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-6 h-6" />
          <span className="text-lg">{event.data.split("T")[0]}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-6 h-6" />
          <span className="text-lg">{event.data.split("T")[1].slice(0, 5)}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6" />
          <span className="text-lg">Cala More</span>
        </div>
        <div className="text-2xl font-bold text-yellow-400 mb-6 text-center md:text-left">
          Countdown: {countdown}
        </div>

        <EventForm />
      </div>
    </div>
  );
};

export default EventCard;
