"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Evento {
  id: number;
  nome: string;
  persone_in_lista: number;
  ingressi_effettivi: number;
}

const ListaEventi = () => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalePagine, setTotalePagine] = useState(1);
  const [caricamento, setCaricamento] = useState(true);
  const perPagina = 5;
  const router = useRouter();

  const fetchEventi = useCallback(async () => {
    try {
      setCaricamento(true);
      const response = await axios.get(`/api/admin/eventi?page=${pagina}&limit=${perPagina}`);
      setEventi(response.data.eventi);
      setTotalePagine(response.data.totalePagine);
    } catch (error) {
      console.error("Errore nel caricamento eventi", error);
    } finally {
      setCaricamento(false);
    }
  }, [pagina, perPagina]);

  useEffect(() => {
    fetchEventi();
  }, [fetchEventi]);

  return (
    <div className="w-full max-w-5xl mx-auto p-3 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center">Lista Eventi</h2>

      {caricamento ? (
        <div className="animate-pulse space-y-2">
          {[...Array(perPagina)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
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
              {eventi.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-3 text-gray-500">
                    Nessun evento disponibile
                  </td>
                </tr>
              ) : (
                eventi.map((evento) => (
                  <tr key={evento.id} className="border-b border-gray-200">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalePagine > 1 && (
        <div className="flex justify-center mt-3 space-x-1 text-sm">
          <button
            onClick={() => setPagina(pagina - 1)}
            disabled={pagina === 1}
            className={`px-3 py-1 rounded-md ${
              pagina === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            ← Precedente
          </button>
          <span className="px-2 py-1 text-gray-700">Pagina {pagina} di {totalePagine}</span>
          <button
            onClick={() => setPagina(pagina + 1)}
            disabled={pagina === totalePagine}
            className={`px-3 py-1 rounded-md ${
              pagina === totalePagine ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
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
