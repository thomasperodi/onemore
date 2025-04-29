"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import EventCard from '@/components/Lista/EventCard';
import Navbar from '@/components/landing/Navbar';

// Questo file va posizionato in /app/lista/[eventId]/page.tsx
const ListaPage: React.FC = () => {
  // Estrae eventId dalla route dinamica (/lista/7)
  const params = useParams();
  const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? '';

  return (
    <main className="space-y-0">
      <Navbar />
      <div className="py-12" />
      <EventCard eventId={eventId} />
      <div className="py-12" />
    </main>
  );
};

export default ListaPage;
