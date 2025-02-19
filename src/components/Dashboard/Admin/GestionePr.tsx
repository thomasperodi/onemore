"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, PlusCircle, Search, Info, ChevronLeft, ChevronRight, Edit, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface PR {
  id: string;
  nome: string;
  cognome: string;
  totale_ospiti: number;
}

const GestionePR = () => {
  const [prList, setPrList] = useState<PR[]>([]);
  const [search, setSearch] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editCognome, setEditCognome] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    fetchPRList();
  }, []);

  const fetchPRList = async () => {
    try {
      const response = await axios.get("/api/admin/pr/storico");
      setPrList(response.data);
    } catch {
      setError("Errore nel recupero dei PR");
    }
  };

  const formatString = (str: string) => {
    return str.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  const handleAddPR = async () => {
    if (!nome.trim() || !cognome.trim()) return;

    const formattedNome = formatString(nome);
    const formattedCognome = formatString(cognome);

    try {
      await axios.post("/api/admin/pr", { nome: formattedNome, cognome: formattedCognome });
      fetchPRList();
      setNome("");
      setCognome("");
    } catch {
      setError("Errore durante l'aggiunta del PR");
    }
  };

  const handleUpdatePR = async (id: string) => {
    if (!editNome.trim() || !editCognome.trim()) return;

    const formattedNome = formatString(editNome);
    const formattedCognome = formatString(editCognome);

    try {
      await axios.put("/api/admin/pr", { id, nome: formattedNome, cognome: formattedCognome });
      fetchPRList();
      setEditingId(null);
    } catch {
      setError("Errore durante la modifica del PR");
    }
  };

  const handleEditClick = (pr: PR) => {
    setEditingId(pr.id);
    setEditNome(pr.nome);
    setEditCognome(pr.cognome);
  };

  const handleDeletePR = async (id: string) => {
    try {
      await axios.delete("/api/admin/pr", { data: { id } });
      fetchPRList();
    } catch {
      setError("Errore durante l'eliminazione del PR");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredPRList = prList.filter((pr) =>
    `${pr.nome} ${pr.cognome}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPRList.length / itemsPerPage);
  const paginatedPRList = filteredPRList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Gestione PR</h3>

      {/* Barra di ricerca */}
      <div className="relative mb-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring focus:ring-blue-200"
          placeholder="Cerca per nome o cognome..."
          value={search}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Form per aggiungere un nuovo PR */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg flex-1"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg flex-1"
          placeholder="Cognome"
          value={cognome}
          onChange={(e) => setCognome(e.target.value)}
        />
        <button onClick={handleAddPR} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
          <PlusCircle size={20} />
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Lista PR */}
      <div className="mt-4">
        {filteredPRList.length === 0 ? (
          <p className="text-center text-gray-500">Nessun PR trovato.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPRList.map((pr) => (
            <div key={pr.id} className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col">
              <p className="text-xl font-bold text-gray-800">{pr.nome} {pr.cognome}</p>
              <p className="text-sm text-gray-500 mt-1">Persone in lista: <span className="font-medium text-gray-700">{pr.totale_ospiti}</span></p>
              
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => router.push(`/admin/dashboard/pr/${pr.id}`)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  <Info size={20} />
                </button>
                <button
                  onClick={() => handleEditClick(pr)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-all">
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeletePR(pr.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
              
              {editingId === pr.id && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg shadow-inner">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:ring focus:ring-blue-300"
                    placeholder="Nome"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:ring focus:ring-blue-300"
                    placeholder="Cognome"
                    value={editCognome}
                    onChange={(e) => setEditCognome(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleUpdatePR(pr.id)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Paginazione */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft size={20} />
          </button>
          <span>{currentPage} di {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GestionePR;
