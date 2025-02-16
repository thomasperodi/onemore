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
  const searchParams = useSearchParams();

  // Gestisce i campi di input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestisce la checkbox per la privacy
  const handleCheckboxChange = () => {
    setConsenso(!consenso);
  };

  // Recupera il PR ID, eventoId e verifica chiusura lista
  useEffect(() => {
    const urlPrId = searchParams.get("pr_id");
    const storedEventoId = localStorage.getItem("eventId");

    if (urlPrId) {
      setPrId(urlPrId);
      Cookies.set("pr_id", urlPrId, { expires: 7 }); 
    } else {
      const storedPrId = Cookies.get("pr_id");
      if (storedPrId) setPrId(storedPrId);
      else {
        Cookies.set("pr_id", "87e712bd-52a0-46b5-96be-ed708f8ed4ab", { expires: 1 }); // Se non c'è, imposta un valore predefinito
        setPrId("1");
      }
    }

    if (storedEventoId) {
      setEventoId(storedEventoId);
    } else {
      console.error("Nessun eventoId trovato in localStorage.");
    }

    // Recupera la chiusura della lista dall'API
    const fetchEventData = async () => {
      try {
        const response = await fetch("/api/active-event");
        const data = await response.json();

        if (data && data.length > 0) {
          const { orario_chiusura } = data[0];
          const chiusura = new Date(orario_chiusura).getTime();

          const now = new Date().getTime();
          if (chiusura <= now) {
            setListaChiusa(true);
          }
        }
      } catch (error) {
        console.error("Errore nel recupero dell'evento attivo:", error);
      }
    };

    fetchEventData();
  }, [searchParams]);

  // Gestisce l'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (listaChiusa) {
      alert("La lista è chiusa, non puoi più registrarti.");
      return;
    }

    if (!consenso) {
      alert("Devi accettare il trattamento dei dati personali.");
      return;
    }

    if (!prId) {
      alert("Errore: nessun PR di riferimento trovato.");
      return;
    }

    if (!eventoId) {
      alert("Errore: nessun ID evento trovato.");
      return;
    }

    const payload = {
      nome: formData.nome,
      cognome: formData.cognome,
      prId,
      eventoId,
    };

    try {
      const response = await fetch("/api/join-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Registrazione completata con successo!");
        setFormData({ nome: "", cognome: "" });
        setConsenso(false);
      } else {
        alert("Errore durante la registrazione. Riprova.");
      }
    } catch (error) {
      console.error("Errore durante l'invio:", error);
      alert("Si è verificato un errore imprevisto. Riprova più tardi.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        placeholder="Nome"
        required
        className="w-full p-3 rounded-lg text-black text-lg"
        disabled={listaChiusa}
      />
      <input
        type="text"
        name="cognome"
        value={formData.cognome}
        onChange={handleChange}
        placeholder="Cognome"
        required
        className="w-full p-3 rounded-lg text-black text-lg"
        disabled={listaChiusa}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="consenso"
          checked={consenso}
          onChange={handleCheckboxChange}
          className="w-5 h-5"
          disabled={listaChiusa}
        />
        <label htmlFor="consenso" className="text-sm">
          Accetto il trattamento dei dati personali
        </label>
      </div>

      <button
        type="submit"
        className={`w-full ${
          listaChiusa ? "bg-gray-500" : "bg-pink-600 hover:bg-pink-700"
        } text-white py-3 rounded-lg text-lg shadow-md transition duration-300`}
        disabled={listaChiusa}
      >
        {listaChiusa ? "Lista Chiusa" : "Inserisciti in Lista"}
      </button>
    </form>
  );
};

export default EventForm;
