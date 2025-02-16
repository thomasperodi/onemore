"use client";
import React, { useState, useEffect } from "react";

interface Event {
  id: number;
  nomeEvento: string;
  numeroNomi: number;
  data: string;
}

const EventHistory = () => {
  const [eventi, setEventi] = useState<Event[]>([]);
  
  useEffect(() => {
    // Simulazione dati statici
    const simulatedData: Event[] = [
      { id: 1, nomeEvento: "Evento A", numeroNomi: 20, data: "2024-02-01" },
      { id: 2, nomeEvento: "Evento B", numeroNomi: 35, data: "2024-02-02" },
      { id: 3, nomeEvento: "Evento C", numeroNomi: 50, data: "2024-02-03" },
      { id: 4, nomeEvento: "Evento D", numeroNomi: 15, data: "2024-02-04" },
      { id: 5, nomeEvento: "Evento E", numeroNomi: 40, data: "2024-02-05" },
      { id: 6, nomeEvento: "Evento F", numeroNomi: 25, data: "2024-02-06" },
      { id: 7, nomeEvento: "Evento G", numeroNomi: 30, data: "2024-02-07" },
      { id: 8, nomeEvento: "Evento H", numeroNomi: 45, data: "2024-02-08" },
      { id: 9, nomeEvento: "Evento I", numeroNomi: 55, data: "2024-02-09" },
      { id: 10, nomeEvento: "Evento J", numeroNomi: 60, data: "2024-02-10" }
    ];
    
    // Ordinare gli eventi dal più recente al più vecchio
    const sortedData = simulatedData.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    setEventi(sortedData);
  }, []);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full md:w-96 max-h-80 overflow-y-auto mt-6 md:mt-0">
      <h2 className="text-xl font-bold mb-4 text-center">Storico Eventi</h2>
      <ul className="space-y-3">
        {eventi.length > 0 ? (
          eventi.map((evento) => (
            <li key={evento.id} className="p-4 border-b last:border-none bg-gray-100 rounded-lg shadow-sm">
              <p className="text-lg font-semibold text-gray-800">{evento.nomeEvento}</p>
              <p className="text-md text-gray-700">Nomi registrati: <span className="font-bold">{evento.numeroNomi}</span></p>
              <p className="text-md text-gray-600">Data: {new Date(evento.data).toLocaleDateString()}</p>
            </li>
          ))
        ) : (
          <p className="text-md text-gray-500 text-center">Nessun evento registrato.</p>
        )}
      </ul>
    </div>
  );
};

export default EventHistory;