"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import AdminDashboardLayout from "@/components/Dashboard/Admin/DashboardLayout";

interface PRDetail {
  nome: string;
  cognome: string;
  storico_eventi: { evento_nome: string; ospiti_totali: number; ospiti_entrati: number }[];
}

export default function PRPage() {
  const params = useParams();
  const [pr, setPr] = useState<PRDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const fetchPRDetails = async () => {
      try {
        const response = await axios.get(`/api/admin/pr/storico/${params.id}`);
        setPr(response.data);
        setLoading(false);
      } catch  {
        setError("Errore nel recupero dei dati");
        setLoading(false);
      }
    };

    fetchPRDetails();
  }, [params?.id]);

  if (loading) {
    return <p className="p-6 text-gray-700">Caricamento...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <main className="space-y-0">
      <AdminDashboardLayout>
    <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">{pr?.nome} {pr?.cognome}</h1>
      <h2 className="text-lg text-gray-600 mt-2">Storico Eventi</h2>

      {pr?.storico_eventi.length ? (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Evento</th>
                <th className="p-3 text-left">Ospiti Totali</th>
                <th className="p-3 text-left">Ospiti Entrati</th>
              </tr>
            </thead>
            <tbody>
              {pr.storico_eventi.map((evento, index) => (
                <tr key={index} className="border-t bg-white hover:bg-gray-100">
                  <td className="p-3">{evento.evento_nome}</td>
                  <td className="p-3 text-blue-600 font-bold">{evento.ospiti_totali}</td>
                  <td className={`p-3 font-bold ${evento.ospiti_entrati > 0 ? "text-green-600" : "text-red-600"}`}>
                    {evento.ospiti_entrati}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 p-3 mt-4">Nessun evento registrato</p>
      )}
    </div>
    </AdminDashboardLayout>
      
      
      
    </main>
  );
}
