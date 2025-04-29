"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock } from 'lucide-react';
import EventForm from './EventForm';
import LinkGoogleMaps from './EventMap';

interface Event {
  id: number;
  locandina: string;
  indirizzo: string;
  nome: string;
  data: string;
}

interface EventCardProps {
  eventId: string;
}

const EventCard: React.FC<EventCardProps> = ({ eventId }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log('Fetching event with ID:', eventId);
        const res = await fetch(`/api/active-event/${eventId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Event | Event[] = await res.json();
        // Se l'API ritorna un array, prendi il primo elemento
        const evt: Event = Array.isArray(data) ? data[0] : data;
        setEvent(evt);
        if (evt.data) {
          startCountdown(evt.data);
        }
      } catch (err) {
        console.error('Errore fetch evento:', err);
      }
    };
    fetchEvent();
  }, [eventId]);

  const startCountdown = (targetTime: string) => {
    const interval = setInterval(() => {
      const now = Date.now();
      const target = new Date(targetTime).getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        setCountdown("L'evento è iniziato");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${days}g ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
  };

  if (!event) return <p className="text-white">Caricamento evento in corso...</p>;

  // Formatta data e orario via Date per evitare split su stringhe undefined
  const d = new Date(event.data);
  const dateStr = d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

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
        <h1 className="text-4xl font-extrabold text-pink-500 text-center md:text-left">
          {event.nome}
        </h1>
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6" />
          <span>{timeStr}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          <LinkGoogleMaps indirizzo={event.indirizzo} />
        </div>
        <div className="text-2xl font-bold text-yellow-400">
          Countdown: {countdown}
        </div>
        <EventForm eventoId={eventId} />
      </div>
    </div>
  );
};

export default EventCard;
