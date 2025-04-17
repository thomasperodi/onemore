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
      <main className="max-w-md mx-auto px-3 py-4 bg-white shadow rounded-lg">
        <h1 className="text-xl font-bold text-gray-800 text-center mb-3">{evento.nome}</h1>

        {/* Locandina */}
        <div className="w-full flex justify-center mb-3">
          <Image
            src={evento.locandina}
            alt={`Locandina di ${evento.nome}`}
            width={180}
            height={270}
            className="rounded-md shadow w-[140px] sm:w-[180px]"
          />
        </div>

        {/* Info Evento */}
        <div className="text-center text-gray-700 text-sm mb-4">
          <p><span className="font-semibold">Data:</span> {new Date(evento.data).toLocaleString()}</p>
          <p><span className="font-semibold">Incasso totale:</span> €{incassoTotale}</p>
        </div>

        {/* Tabella */}
        <h2 className="text-base font-semibold text-gray-700 mb-2 text-center">Ingressi per Prezzo</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border border-gray-300 rounded-md shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border-b">Prezzo</th>
                <th className="py-2 px-3 border-b">Ingressi</th>
              </tr>
            </thead>
            <tbody>
              {[10, 12, 15].map((prezzo) => (
                <tr key={prezzo} className="border-b">
                  <td className="py-2 px-3">€{prezzo.toFixed(2)}</td>
                  <td className="py-2 px-3">{ingressiPerPrezzo[prezzo] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </AdminDashboardLayout>
  );
};

export default DettaglioEvento;
