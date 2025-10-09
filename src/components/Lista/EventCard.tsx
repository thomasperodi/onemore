'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock } from 'lucide-react';
import EventForm from './EventForm';
import LinkGoogleMaps from './EventMap';
import { useRouter } from 'next/navigation';

interface Event {
  id: number;
  locandina: string;
  indirizzo: string;
  nome: string;
  data: string;
  attivo: boolean;
}

interface EventCardProps {
  eventId: string;
}

const EventCard: React.FC<EventCardProps> = ({ eventId }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [countdown, setCountdown] = useState<string>('');
  const [eventoNonDisponibile, setEventoNonDisponibile] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/active-event/${eventId}`);
        if (!res.ok) {
          if (res.status === 500) {
            setEventoNonDisponibile(true);
          }
          throw new Error(`HTTP ${res.status}`);
        }

        const data: Event | Event[] = await res.json();
        const evt: Event = Array.isArray(data) ? data[0] : data;

        if (!evt || !evt.data) {
          setEventoNonDisponibile(true);
          return;
        }

        setEvent(evt);
        startCountdown(evt.data);
      } catch (err) {
        console.error('Errore fetch evento:', err);
        setEventoNonDisponibile(true);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (eventoNonDisponibile) {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [eventoNonDisponibile, router]);

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

  if (eventoNonDisponibile) {
    return (
      <div className="text-center text-white p-6 min-h-[300px]">
        <h1 className="text-3xl font-bold text-red-500">Evento non disponibile</h1>
        <p className="mt-4 text-black text-lg">
          Questo evento non è più attivo o non esiste. Contatta il tuo PR per un link aggiornato.
        </p>
        <p className="mt-2 text-sm text-gray-300 italic">Verrai reindirizzato alla home...</p>
      </div>
    );
  }

  if (!event) return <p className="text-white text-center py-12">Caricamento evento in corso...</p>;

  const d = new Date(event.data);
  const dateStr = d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-black rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[90vh]">
      <div className="relative w-full md:w-2/5 aspect-[2/3]">
        <Image
          src={event.locandina}
          alt={event.nome}
          fill
          className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
          sizes="(max-width: 768px) 100vw, 40vw"
          priority
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
        <div className="text-2xl font-bold text-yellow-400 font-mono min-h-[2rem]">
          Countdown: {countdown}
        </div>
        <EventForm eventoId={eventId} />
      </div>
    </div>
  );
};

export default EventCard;