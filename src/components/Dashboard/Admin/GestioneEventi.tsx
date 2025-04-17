"use client";

import { useState } from "react";
import axios from "axios";
import { PlusCircle, Loader2 } from "lucide-react";

const GestioneEventi = () => {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [locandina, setLocandina] = useState<File | null>(null);
  const [indirizzo, setIndirizzo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddEvento = async () => {
    setError(null);
    setSuccess(null);

    if (!nome.trim() || !data || !locandina || !indirizzo.trim()) {
      setError("Compila tutti i campi.");
      return;
    }

    try {
      setLoading(true);
      let locandinaUrl = "";

      const formData = new FormData();
      formData.append("file", locandina);

      const uploadResponse = await axios.post("/api/admin/eventi/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      locandinaUrl = uploadResponse.data.fileUrl;

      await axios.post("/api/admin/eventi", {
        nome: nome.trim(),
        data,
        locandina: locandinaUrl,
        indirizzo: indirizzo.trim(),
      });

      setSuccess("Evento aggiunto con successo 🎉");
      setNome("");
      setData("");
      setIndirizzo("");
      setLocandina(null);

      setTimeout(() => setSuccess(null), 5000);
    } catch {
      setError("Errore durante l'aggiunta dell'evento. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-2 w-full max-w-6xl mx-auto mb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Aggiungi Evento</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          className="p-2 border text-sm rounded w-full"
          placeholder="Nome evento"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="datetime-local"
          className="p-2 border text-sm rounded w-full"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border text-sm rounded w-full"
          placeholder="Indirizzo evento"
          value={indirizzo}
          onChange={(e) => setIndirizzo(e.target.value)}
        />
        <input
          type="file"
          className="p-2 border text-sm rounded w-full"
          accept="image/*"
          onChange={(e) => setLocandina(e.target.files ? e.target.files[0] : null)}
        />
      </div>

      <button
        onClick={handleAddEvento}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 text-sm text-white rounded-md p-2 transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
        {loading ? "Aggiungendo..." : "Aggiungi Evento"}
      </button>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-100 border border-red-300 rounded p-2 mt-2">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-sm text-center bg-green-100 border border-green-300 rounded p-2 mt-2">
          {success}
        </div>
      )}
    </div>
  );
};

export default GestioneEventi;
