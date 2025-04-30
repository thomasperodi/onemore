"use client";

import React, { useEffect, useState } from "react";

interface Props {
  eventoId: number;
  nomeEvento: string;
  prId: string | null;
}

const CurrentEventCount = ({ eventoId, nomeEvento, prId }: Props) => {
  const [currentEventCount, setCurrentEventCount] = useState(0);

  const fetchCurrentEventCount = async () => {
    if (!eventoId || !prId) return;

    try {
      const res = await fetch(`/api/pr/list/current?evento_id=${eventoId}&pr_id=${prId}`);
      if (!res.ok) {
        throw new Error(`Errore API: ${res.status}`);
      }

      const data = await res.json();
      setCurrentEventCount(data.count || 0);
    } catch (error) {
      console.error("Errore nel recupero del conteggio ospiti:", error);
    }
  };

  useEffect(() => {
    fetchCurrentEventCount();
    const interval = setInterval(fetchCurrentEventCount, 10000); // aggiorna ogni 10s
    return () => clearInterval(interval);
  }, [eventoId, prId]);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          Persone in lista per {nomeEvento}
        </h3>
        <p className="text-4xl font-bold text-blue-600">
          {currentEventCount}
        </p>
      </div>
    </div>
  );
};

export default CurrentEventCount;
