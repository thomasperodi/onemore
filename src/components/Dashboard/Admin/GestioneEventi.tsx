"use client";

import { useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";

const GestioneEventi = () => {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [locandina, setLocandina] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleAddEvento = async () => {
    if (!nome || !data || !locandina) return;
  
    try {
      let locandinaUrl = "";

      // Invia il file al backend per l'upload
      const formData = new FormData();
      formData.append("file", locandina);

      const uploadResponse = await axios.post("/api/admin/eventi/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      locandinaUrl = uploadResponse.data.fileUrl;

      // Invia i dati dell'evento al backend
      await axios.post("/api/admin/eventi", {
        nome,
        data,
        locandina: locandinaUrl,
      });

      // Resetta il form dopo l'invio
      setNome("");
      setData("");
      setLocandina(null);
    } catch  {
      setError("Errore durante l'aggiunta dell'evento");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-6xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Gestione Eventi</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          className="p-3 border rounded-lg w-full"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="datetime-local"
          className="p-3 border rounded-lg w-full"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <input
          type="file"
          className="p-3 border rounded-lg w-full"
          accept="image/*"
          onChange={(e) => setLocandina(e.target.files ? e.target.files[0] : null)}
        />
        <button
          onClick={handleAddEvento}
          className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center w-full"
        >
          <PlusCircle size={24} />
          <span className="ml-2">Aggiungi Evento</span>
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default GestioneEventi;
