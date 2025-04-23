"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

const EventForm = () => {
  const [formData, setFormData] = useState({ nome: "", cognome: "" });
  const [consenso, setConsenso] = useState(false);
  const [prId, setPrId] = useState<string | null>(null);
  const [listaChiusa, setListaChiusa] = useState<boolean>(false);
  const [eventoId, setEventoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => setConsenso(!consenso);

  useEffect(() => {
    const urlPrId = searchParams.get("pr_id");
    const storedEventoId = localStorage.getItem("eventId");

    if (urlPrId) {
      setPrId(urlPrId);
      Cookies.set("pr_id", urlPrId, { expires: 1 });
    } else {
      const storedPrId = Cookies.get("pr_id");
      if (storedPrId) {
        setPrId(storedPrId);
      } else {
        const defaultPrId = "87e712bd-52a0-46b5-96be-ed708f8ed4ab"; // <-- ID PR di default
        setPrId(defaultPrId);
        Cookies.set("pr_id", defaultPrId, { expires: 1 });
      }
    }

    if (storedEventoId) {
      setEventoId(storedEventoId);
    } else {
      console.error("Nessun eventoId trovato in localStorage.");
    }

    const fetchEventData = async () => {
      try {
        const response = await fetch("/api/active-event");
        const data = await response.json();

        if (data?.length > 0) {
          const eventoInizio = new Date(data[0].data).getTime();
          if (eventoInizio <= Date.now()) {
            setListaChiusa(true);
          }
        }
      } catch (error) {
        console.error("Errore nel recupero dell'evento attivo:", error);
      }
    };

    fetchEventData();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (listaChiusa) return setMessage({ text: "La lista è chiusa, non puoi più registrarti.", type: "error" });
    if (!consenso) return setMessage({ text: "Devi accettare il trattamento dei dati personali.", type: "error" });
    if (!prId) return setMessage({ text: "Errore: nessun PR di riferimento trovato.", type: "error" });
    if (!eventoId) return setMessage({ text: "Errore: nessun ID evento trovato.", type: "error" });

    setLoading(true);

    try {
      const response = await fetch("/api/join-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, prId, eventoId }),
      });

      if (response.ok) {
        setMessage({ text: "Ti sei inserito in lista correttamente!", type: "success" });
        setFormData({ nome: "", cognome: "" });
        setConsenso(false);
      } else if(response.status === 409) {
        setMessage({ text:"Nome già in lista.", type: "error" });
      }
      else {
        setMessage({ text: "Errore durante la registrazione", type: "error" });
      }
    } catch {
      setMessage({ text: "Si è verificato un errore imprevisto. Riprova più tardi.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 text-white rounded-lg ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

<input
  type="text"
  name="nome"
  value={formData.nome}
  onChange={handleChange}
  placeholder="Nome"
  required
  className="w-full bg-white text-black placeholder-gray-500 border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
  disabled={listaChiusa || loading}
/>

<input
  type="text"
  name="cognome"
  value={formData.cognome}
  onChange={handleChange}
  placeholder="Cognome"
  required
  className="w-full bg-white text-black placeholder-gray-500 border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
  disabled={listaChiusa || loading}
/>

<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="consenso"
    checked={consenso}
    onChange={handleCheckboxChange}
    className="w-5 h-5 accent-pink-600"
    disabled={listaChiusa || loading}
  />
  <label htmlFor="consenso" className="text-sm text-white">
    Accetto il trattamento dei dati personali
  </label>
</div>


      <button
        type="submit"
        className={`w-full flex justify-center items-center gap-2 ${
          listaChiusa ? "bg-gray-500" : "bg-pink-600 hover:bg-pink-700"
        } text-white py-3 rounded-lg text-lg shadow-md transition duration-300`}
        disabled={listaChiusa || loading}
      >
        {loading ? (
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
        ) : listaChiusa ? (
          "Lista Chiusa"
        ) : (
          "Inserisciti in Lista"
        )}
      </button>
    </form>
  );
};

export default EventForm;
