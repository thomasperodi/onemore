'use client';

    import React, { useState, useEffect } from 'react';
    import Image from 'next/image';
    import { MapPin } from 'lucide-react';
    
    import {
      Card,
      CardContent,
      CardFooter,
    } from '@/components/ui/card';
    import { Button } from '@/components/ui/Button';
import Link from 'next/link';
    
    interface ActiveEvent {
      id: string;
      locandina: string;
      data: string;
      nome: string;
      indirizzo: string;
      link: string;
    }
    
    const ActiveEvents: React.FC = () => {
      const [events, setEvents] = useState<ActiveEvent[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
    
      useEffect(() => {
        async function fetchEvents() {
          try {
            const res = await fetch('/api/active-event');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: ActiveEvent[] = await res.json();
            setEvents(data);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore sconosciuto');
          } finally {
            setLoading(false);
          }
        }
        fetchEvents();
      }, []);
    
      if (loading) return (
        <section className="py-12 text-center">
          <p>Caricamento eventi attivi…</p>
        </section>
      );
    
      if (error) return (
        <section className="py-12 text-center">
          <p className="text-destructive">Errore: {error}</p>
        </section>
      );
    
      if (events.length === 0) return (
        <section className="py-12 text-center">
          <p>Nessun evento attivo al momento.</p>
        </section>
      );
    
      return (
        <section className="px-4 md:px-8 lg:px-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Eventi Attivi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map(ev => {
              const d = new Date(ev.data);
              const dateStr = d.toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              });
              const timeStr = d.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit',
              });
    
              return (
                <Card
                  key={ev.id}
                  className="flex flex-col hover:shadow-xl hover:-translate-y-1 transition-transform duration-200"
                >
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-square">
                      {ev.locandina ? (
                        <Image
                          src={ev.locandina}
                          alt={ev.nome}
                          fill
                          className="object-cover hover:opacity-80 transition rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-t-lg">
                          <span className="text-gray-600">Immagine non disponibile</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
    
                  <CardContent className="flex-1">
                    
                    <h3 className="text-lg font-bold ">{ev.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {dateStr} • {timeStr}
                    </p>
                    <p className="flex items-center justify-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {ev.indirizzo}
                    </p>
                  </CardContent>
    
                    <CardFooter className="items-center justify-center">
                        <Button asChild className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                            <Link href={`/lista/${ev.id}`} className="block w-full py-2 text-center">
                                Mettiti in lista
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      );
    };
    
    export default ActiveEvents;
    