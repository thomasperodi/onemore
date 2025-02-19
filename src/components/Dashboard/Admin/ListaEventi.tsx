"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ListaEventi = () => {
  const [eventi, setEventi] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [caricamento, setCaricamento] = useState(true);
  const perPagina = 5; // Numero di eventi per pagina
  const router = useRouter();

  useEffect(() => {
    const fetchEventi = async () => {
      try {
        setCaricamento(true);
        const response = await axios.get("/api/admin/eventi");
        setEventi(response.data);
      } catch (error) {
        console.error("Errore nel caricamento eventi", error);
      } finally {
        setCaricamento(false);
      }
    };

    fetchEventi();
  }, []);

  // Calcola gli eventi da mostrare nella pagina attuale
  const inizio = (pagina - 1) * perPagina;
  const eventiPaginati = eventi.slice(inizio, inizio + perPagina);
  const pagineTotali = Math.ceil(eventi.length / perPagina);

  return (
    <div className="w-full max-w-5xl mx-auto p-3 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center">
        Lista Eventi
      </h2>

      {caricamento ? (
        <p className="text-center text-gray-500 text-sm">Caricamento...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-md text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="p-2 text-left">Nome Evento</th>
                <th className="p-2 text-center">Persone in Lista</th>
                <th className="p-2 text-center">Entrate Effettive</th>
                <th className="p-2 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {eventiPaginati.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-3 text-gray-500">
                    Nessun evento disponibile
                  </td>
                </tr>
              ) : (
                eventiPaginati.map(
                  (evento: {
                    ingressi_effettivi: number;
                    persone_in_lista: number; id: number; nome: string;
}, index: number) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2">{evento.nome}</td>
                      <td className="p-2 text-center">{evento.persone_in_lista || 0}</td>
                      <td className="p-2 text-center">{evento.ingressi_effettivi || 0}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => router.push(`/admin/dashboard/eventi/${evento.id}`)}
                          className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md transition duration-200"
                        >
                          Info
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginazione */}
      {pagineTotali > 1 && (
        <div className="flex justify-center mt-3 space-x-1">
          <button
            onClick={() => setPagina(pagina - 1)}
            disabled={pagina === 1}
            className={`px-3 py-1 text-xs rounded-md ${
              pagina === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            ← Precedente
          </button>
          <span className="px-2 py-1 text-gray-700 text-xs">
            Pagina {pagina} di {pagineTotali}
          </span>
          <button
            onClick={() => setPagina(pagina + 1)}
            disabled={pagina === pagineTotali}
            className={`px-3 py-1 text-xs rounded-md ${
              pagina === pagineTotali ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Successivo →
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaEventi;
