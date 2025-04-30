
"use client";

import { useEffect, useState } from "react";
import ContatoriOspiti from "@/components/Dashboard/Admin/ContatoriOspiti";
import AdminDashboardLayout from "@/components/Dashboard/Admin/DashboardLayout";
import ListaOspiti from "@/components/Dashboard/Admin/Lista";

interface Evento {
  id: number;
  nome: string;
}

const AdminDashboardComponent = () => {
  const [eventiAttivi, setEventiAttivi] = useState<Evento[]>([]);
  const [eventoSelezionato, setEventoSelezionato] = useState<Evento | null>(null);

  useEffect(() => {
    const fetchEventi = async () => {
      try {
        const res = await fetch("/api/active-event");
        const data = await res.json();
        setEventiAttivi(data);
        if (data.length > 0) {
          setEventoSelezionato(data[0]); // primo evento di default
        }
      } catch (error) {
        console.error("Errore nel recupero degli eventi attivi:", error);
      }
    };

    fetchEventi();
  }, []);

  return (
    <main className="space-y-0">
      <AdminDashboardLayout>
        {eventiAttivi.length > 0 && eventoSelezionato && (
          <div className="w-full max-w-6xl mx-auto mt-2 px-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
              <h2 className="text-lg font-semibold text-gray-800">Dashboard Eventi</h2>
              <select
                className="p-2 border rounded text-sm"
                value={eventoSelezionato.id}
                onChange={(e) =>
                  setEventoSelezionato(
                    eventiAttivi.find((ev) => ev.id === Number(e.target.value)) || null
                  )
                }
              >
                {eventiAttivi.map((evento) => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nome}
                  </option>
                ))}
              </select>
            </div>

            <ContatoriOspiti
              eventoId={eventoSelezionato.id}
              nomeEvento={eventoSelezionato.nome}
            />

            <ListaOspiti
              eventoId={eventoSelezionato.id}
              nomeEvento={eventoSelezionato.nome}
            />
          </div>
        )}
      </AdminDashboardLayout>
    </main>
  );
};

export default AdminDashboardComponent;
