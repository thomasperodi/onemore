"use client"
import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import axios from "axios";

const GuestCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuestCount = async () => {
      try {
        const response = await axios.get("/api/admin/lista-evento");
        setCount(response.data.count);
      } catch {
        setError("Errore nel recupero dei dati");
      }
    };

    fetchGuestCount();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full">
        <Users className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Clienti in lista</h3>
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{count !== null ? count : "..."}</p>
        )}
      </div>
    </div>
  );
};

export default GuestCount;
