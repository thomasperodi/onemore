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
    return <p className="text-center text-gray-500">Caricamento dettagli evento...</p>;
  }

  if (!evento) {
    return <p className="text-center text-red-500">Evento non trovato.</p>;
  }

  const incassoTotale = Object.entries(ingressiPerPrezzo).reduce(
    (total, [prezzo, ingressi]) => total + Number(prezzo) * ingressi,
    0
  );
  return (
    <AdminDashboardLayout>
      <main className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">{evento.nome}</h1>

        {/* Locandina */}
        <div className="w-full flex justify-center mb-4">
          <Image
            src={evento.locandina}
            alt={`Locandina di ${evento.nome}`}
            width={300}
            height={450}
            className="rounded-lg shadow-md w-[200px] sm:w-[300px]"
          />
        </div>
        {/* Informazioni evento */}
        <div className="text-center text-gray-700 mb-4">
          <p><strong>Data:</strong> {new Date(evento.data).toLocaleString()}</p>
          <p><strong>Incasso totale:</strong> €{incassoTotale}</p>
        </div>

        {/* Tabella delle entrate per importo pagato */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 my-4 text-center">Incassi e Ingressi per Prezzo</h2>
        <table className="w-full border border-gray-300 rounded-md overflow-hidden shadow-md text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Importo Pagato (€)</th>
              <th className="py-2 px-4 border-b">Numero di Ingressi</th>
              {/* <th className="py-2 px-4 border-b">Incasso Totale (€)</th> */}
            </tr>
          </thead>
          <tbody>
            {[10, 12, 15].map((prezzo) => (
              <tr key={prezzo} className="border-b">
                <td className="py-2 px-4">€{prezzo.toFixed(2)}</td>
                <td className="py-2 px-4">{ingressiPerPrezzo[prezzo] || 0}</td>
                {/* <td className="py-2 px-4">€{(incassiPerPrezzo[prezzo] || 0).toFixed(2)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </AdminDashboardLayout>
  );
};

export default DettaglioEvento;
