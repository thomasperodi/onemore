"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const ContatoriOspiti = () => {
  const [entrati, setEntrati] = useState(0);
  const [totale, setTotale] = useState(0);
  const [nomeEvento, setNomeEvento] = useState("");
  const [idEventoAttivo, setIdEventoAttivo] = useState<number | null>(null);

  const fetchNomeEvento = async () => {
    try {
      const res = await fetch("/api/active-event");
      const data = await res.json();
      const evento = data[0];
      setNomeEvento(evento?.nome || "Evento attivo");
      setIdEventoAttivo(evento?.id || null);
    } catch (err) {
      console.error("Errore nel recupero nome evento", err);
    }
  };

  const fetchDati = useCallback(async () => {
    if (idEventoAttivo === null) return;

    try {
      const resLista = await axios.get("/api/admin/lista");
      const ospiti = resLista.data;

      interface Ospite {
        ingresso: boolean;
        evento_id: number;
      }

      const ospitiEvento = ospiti.filter((o: Ospite) => o.evento_id === idEventoAttivo);
      const entratiCount = ospitiEvento.filter((o: Ospite) => o.ingresso).length;

      setEntrati(entratiCount);
      setTotale(ospitiEvento.length);
    } catch (err) {
      console.error("Errore nel recupero dei contatori", err);
    }
  }, [idEventoAttivo]);

  useEffect(() => {
    fetchNomeEvento();
  }, []);

  useEffect(() => {
    fetchDati(); // chiamata immediata quando l'id evento è disponibile
    const interval = setInterval(fetchDati, 5000);
    return () => clearInterval(interval);
  }, [idEventoAttivo, fetchDati]);

  return (
    <div className="w-full max-w-6xl mx-auto mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center text-center gap-4">
      <div>
        <h2 className="text-lg font-semibold text-blue-800">Evento attivo</h2>
        <p className="text-xl font-bold text-blue-900">{nomeEvento}</p>
      </div>
      <div className="flex gap-6">
        <div>
          <h3 className="text-sm text-gray-600">In lista</h3>
          <p className="text-2xl font-bold text-gray-800">{totale}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-600">Entrati</h3>
          <p className="text-2xl font-bold text-green-600">{entrati}</p>
        </div>
      </div>
    </div>
  );
};

export default ContatoriOspiti;
