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
      const resLista = await axios.get("/api/admin/lista-evento");
      const ospiti = resLista.data;
      
      

      setEntrati(ospiti.ospiti_entrati);
      setTotale(ospiti.totale_ospiti);
    } catch (err) {
      console.error("Errore nel recupero dei contatori", err);
    }
  }, [idEventoAttivo]);

  useEffect(() => {
    fetchNomeEvento();
  }, []);

  useEffect(() => {
    fetchDati();
    const interval = setInterval(fetchDati, 5000);
    return () => clearInterval(interval);
  }, [idEventoAttivo, fetchDati]);

  return (
    <div className="w-full max-w-md mx-auto mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center text-sm">
      <div className="text-center sm:text-left">
  
        <p className="text-sm font-semibold text-blue-900 truncate">Evento - {nomeEvento}</p>
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
