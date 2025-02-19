"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";

interface Event {
  id: number;
  nome: string;
  data: string;
  ospiti: number;
}

const EventHistory = () => {
  const [eventi, setEventi] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventHistory = async () => {
      try {
        const response = await axios.get("/api/admin/eventi-passati");
        setEventi(response.data);
      } catch {
        setError("Errore nel recupero dello storico eventi");
      }
    };

    fetchEventHistory();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
        <Calendar className="w-6 h-6 mr-2 text-gray-600" />
        Storico Eventi
      </h3>

      {error ? (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      ) : eventi.length === 0 ? (
        <p className="text-gray-500 text-sm mt-2">Nessun evento passato disponibile</p>
      ) : (
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventi.map((evento) => (
              <div
                key={evento.id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
              >
                <h4 className="text-lg font-bold text-gray-800">{evento.nome}</h4>
                <p className="text-gray-500 text-sm">
                  {new Date(evento.data).toLocaleDateString()}
                </p>
                <p className="mt-2 text-blue-600 font-semibold text-lg">
                  {evento.ospiti} {evento.ospiti === 1 ? "ospite" : "ospiti"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHistory;
