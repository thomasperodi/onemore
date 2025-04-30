
"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/Dashboard/Pr/DashboardLayout";
import EventHistory from "@/components/Dashboard/Pr/EventHistory";
import CurrentEventCount from "@/components/Dashboard/Pr/CurrentEventiCount";
import CopyLinkButton from "@/components/Dashboard/Pr/CopyLinkButton";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface Evento {
  id: number;
  nome: string;
}

interface CustomJwtPayload extends JwtPayload {
  pr_id?: string;
}

const DashboardPage = () => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [eventoSelezionato, setEventoSelezionato] = useState<Evento | null>(null);
  const [prId, setPrId] = useState<string | null>(null);

  useEffect(() => {
    const getPrIdFromToken = (): string | null => {
      try {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((row) => row.startsWith("token="));
        if (!tokenCookie) return null;
        const token = tokenCookie.split("=")[1];
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded.pr_id || null;
      } catch (error) {
        console.error("Errore nella decodifica del token:", error);
        return null;
      }
    };

    const fetchEventi = async () => {
      try {
        const res = await fetch("/api/active-event");
        const data = await res.json();
        setEventi(data);
        if (data.length > 0) {
          setEventoSelezionato(data[0]);
        }
      } catch (error) {
        console.error("Errore nel caricamento eventi attivi:", error);
      }
    };

    setPrId(getPrIdFromToken());
    fetchEventi();
  }, []);

  return (
    <main className="space-y-0">
      <DashboardLayout>
        {eventi.length > 0 && eventoSelezionato && (
          <div className="w-full max-w-3xl mx-auto px-4 py-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-xl font-semibold text-gray-800">Dashboard PR</h2>
              <select
                className="p-2 border rounded text-sm w-full sm:w-auto"
                value={eventoSelezionato.id}
                onChange={(e) =>
                  setEventoSelezionato(
                    eventi.find((ev) => ev.id === Number(e.target.value)) || null
                  )
                }
              >
                {eventi.map((evento) => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <CurrentEventCount
                eventoId={eventoSelezionato.id}
                nomeEvento={eventoSelezionato.nome}
                prId={prId}
              />
            </div>

            <div>
              <CopyLinkButton
                eventoId={eventoSelezionato.id}
                prId={prId}
              />
            </div>

            
          </div>
        )}
      </DashboardLayout>
    </main>
  );
};

export default DashboardPage;
