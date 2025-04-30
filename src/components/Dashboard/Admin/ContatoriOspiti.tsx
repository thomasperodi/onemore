"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import axios from "axios";

interface Props {
  eventoId: number | null;
  nomeEvento: string;
}

interface EventoStats {
  evento_id: number;
  nome: string;
  totale_ospiti: number;
  ospiti_entrati: number;
}

const ContatoriOspiti = ({ eventoId, nomeEvento }: Props) => {
  const [entrati, setEntrati] = useState(0);
  const [totale, setTotale] = useState(0);
  const [, startTransition] = useTransition();

  const fetchDati = useCallback(async () => {
    if (eventoId === null) return;

    try {
      const res = await axios.get<EventoStats[]>("/api/admin/lista-evento", {
        headers: { "Cache-Control": "no-store" },
      });

      const evento = res.data.find((e) => e.evento_id === eventoId);
      if (!evento) return;

      startTransition(() => {
        setEntrati(evento.ospiti_entrati);
        setTotale(evento.totale_ospiti);
      });
    } catch (err) {
      console.error("Errore nel recupero dei contatori", err);
    }
  }, [eventoId]);

  useEffect(() => {
    fetchDati();
    const interval = setInterval(fetchDati, 5000);
    return () => clearInterval(interval);
  }, [eventoId, fetchDati]);

  return (
    <div className="w-full max-w-md mx-auto mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center text-sm">
      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold text-blue-900 truncate">
          Evento - {nomeEvento}
        </p>
      </div>
      <div className="flex gap-4 mt-2 sm:mt-0">
        <div className="text-center">
          <p className="text-xs text-gray-500">In lista</p>
          <p className="text-lg font-bold text-gray-800">{totale}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Entrati</p>
          <p className="text-lg font-bold text-green-600">{entrati}</p>
        </div>
      </div>
    </div>
  );
};

export default ContatoriOspiti;
