"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Search, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Ospite {
  id: number;
  evento_id: number;
  nome_utente: string;
  cognome_utente: string;
  ingresso: boolean;
  orario_ingresso: string | null;
  pr: { nome: string; cognome: string } | null;
}

const ITEMS_PER_PAGE_MOBILE = 6;
const ITEMS_PER_PAGE_DESKTOP = 12;

const ListaOspiti = () => {
  const [ospiti, setOspiti] = useState<Ospite[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [nome_evento, setNome_evento] = useState<string>("");
  const [id_evento_attivo, setId_evento_attivo] = useState<number | null>(null);

  const fetchEventoAttivo = async () => {
    try {
      const res = await fetch("/api/active-event");
      const data = await res.json();
      setNome_evento(data[0].nome);
      setId_evento_attivo(data[0].id);
    } catch (error) {
      console.error("Errore nel recupero dei dati evento attivo:", error);
    }
  };

  const fetchListaOspiti = async (eventoId: number) => {
    try {
      const response = await axios.get(`/api/admin/lista?evento_id=${eventoId}`);
      setOspiti(response.data);
    } catch {
      setError("Errore nel recupero della lista ospiti");
    }
  };
  

  useEffect(() => {
    const init = async () => {
      await fetchEventoAttivo();
    };
    init();
  }, []);

  useEffect(() => {
    if (id_evento_attivo !== null) {
      fetchListaOspiti(id_evento_attivo);
    }
  }, [id_evento_attivo]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [search]);

  const filteredOspiti = ospiti.filter((ospite) =>
    `${ospite.nome_utente} ${ospite.cognome_utente}`.toLowerCase().includes(search.toLowerCase())
  );

  const ITEMS_PER_PAGE = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
  const totalPages = Math.ceil(filteredOspiti.length / ITEMS_PER_PAGE);
  const paginatedOspiti = filteredOspiti.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const handleCheckIn = async (id: number, ingresso: boolean) => {
    try {
      const timestamp = ingresso ? null : new Date().toLocaleString("sv-SE", { timeZone: "Europe/Rome" });

      await axios.patch("/api/admin/lista", { id, ingresso: !ingresso, orario_ingresso: timestamp });

      setOspiti((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, ingresso: !ingresso, orario_ingresso: timestamp } : o
        )
      );
    } catch {
      setError("Errore durante l'aggiornamento dello stato di ingresso");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-3 w-full max-w-6xl mx-auto mt-2">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Lista - {nome_evento}</h3>

      <div className="relative mb-2">
        <input
          type="text"
          className="w-full p-2 text-sm border border-gray-300 rounded pl-9 focus:ring focus:ring-blue-200"
          placeholder="Cerca ospite..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Nome</th>
                  <th className="p-2 text-left">Cognome</th>
                  <th className="p-2 text-left">PR</th>
                  <th className="p-2 text-left">Ingresso</th>
                  <th className="p-2 text-left">Azione</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOspiti.map((ospite, index) => (
                  <tr key={ospite.id} className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="p-2">{ospite.id}</td>
                    <td className="p-2">{ospite.nome_utente}</td>
                    <td className="p-2">{ospite.cognome_utente}</td>
                    <td className="p-2">{ospite.pr ? `${ospite.pr.nome} ${ospite.pr.cognome}` : "N/A"}</td>
                    <td className="p-2">{ospite.ingresso ? "Entrato" : "Non entrato"}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleCheckIn(ospite.id, ospite.ingresso)}
                        className={`p-1 text-white rounded transition ${
                          ospite.ingresso ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {ospite.ingresso ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-2">
            {paginatedOspiti.map((ospite) => (
              <div key={ospite.id} className="p-2 bg-gray-50 rounded shadow border border-gray-200 flex justify-between items-center">
                <div className="flex flex-col text-sm">
                  <h4 className="font-bold text-gray-800">{ospite.nome_utente} {ospite.cognome_utente}</h4>
                  <span className="text-xs text-gray-500">{ospite.pr ? `PR: ${ospite.pr.nome} ${ospite.pr.cognome}` : "N/A"}</span>
                  <span className={`font-semibold ${ospite.ingresso ? "text-green-600" : "text-red-600"}`}>
                    {ospite.ingresso ? "Entrato" : "Non entrato"}
                  </span>
                </div>
                <button
                  onClick={() => handleCheckIn(ospite.id, ospite.ingresso)}
                  className={`p-1 text-white rounded transition ${
                    ospite.ingresso ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {ospite.ingresso ? <XCircle size={16} /> : <CheckCircle size={16} />}
                </button>
              </div>
            ))}
          </div>

          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-2 text-sm">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1 bg-gray-300 rounded disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-gray-700">Pagina {currentPage + 1} di {totalPages}</span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1 bg-gray-300 rounded disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListaOspiti;
