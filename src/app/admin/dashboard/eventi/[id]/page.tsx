"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import AdminDashboardLayout from "@/components/Dashboard/Admin/DashboardLayout";

interface Evento {
  data: string | number | Date;
  id: number;
  nome: string;
  locandina: string;
}

interface IngressiPerPrezzo {
  [key: number]: number;
}

const DettaglioEvento = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [ingressiPerPrezzo, setIngressiPerPrezzo] = useState<IngressiPerPrezzo>({});
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    const fetchDettagliEvento = async () => {
      try {
        const response = await axios.get(`/api/admin/eventi/${id}`);
        setEvento(response.data.evento);
        setIngressiPerPrezzo(response.data.ingressi_per_prezzo || {});
      } catch (error) {
        console.error("Errore nel caricamento dei dettagli dell'evento", error);
      } finally {
        setCaricamento(false);
      }
    };

    fetchDettagliEvento();
  }, [id]);

  if (caricamento) {
    return <p className="text-center text-gray-500 text-sm mt-4">Caricamento dettagli evento...</p>;
  }

  if (!evento) {
    return <p className="text-center text-red-500 text-sm mt-4">Evento non trovato.</p>;
  }

  const incassoTotale = Object.entries(ingressiPerPrezzo).reduce(
    (total, [prezzo, ingressi]) => total + Number(prezzo) * ingressi,
    0
  );

  return (
  <AdminDashboardLayout>
  <main className="w-full max-w-lg mx-auto px-4 py-4 bg-white shadow rounded-xl mb-12">
    <h1 className="text-2xl font-bold text-gray-800 text-center mb-3">{evento.nome}</h1>

    {/* Locandina */}
    <div className="w-full flex justify-center mb-4">
      <Image
        src={evento.locandina}
        alt={`Locandina di ${evento.nome}`}
        width={300}
        height={450}
        className="rounded-lg shadow max-w-[70%] sm:max-w-[200px] h-auto"
      />
    </div>

    {/* Tabella */}
    <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">Ingressi per Prezzo</h2>
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full text-sm text-center border border-gray-300 rounded-md shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-1.5 px-3 border-b">Prezzo</th>
            <th className="py-1.5 px-3 border-b">Ingressi</th>
          </tr>
        </thead>
        <tbody>
          {[10, 12, 15].map((prezzo) => (
            <tr key={prezzo} className="border-b">
              <td className="py-1.5 px-3">€{prezzo.toFixed(2)}</td>
              <td className="py-1.5 px-3">{ingressiPerPrezzo[prezzo] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <button
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      onClick={() => alert(`Incasso totale: €${incassoTotale.toFixed(2)}`)}
    >
      Visualizza Incasso Totale
    </button>
  </main>
</AdminDashboardLayout>
  );
};

export default DettaglioEvento;
