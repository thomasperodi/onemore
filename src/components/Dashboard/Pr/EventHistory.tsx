"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Event {
  id: number;
  nomeEvento: string;
  numeroNomi: number;
  data: string;
}

interface TokenPayload {
  pr_id: number;
  // altri campi opzionali se presenti nel tuo JWT
}

const EventHistory = () => {
  const [eventi, setEventi] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPrIdFromCookie = () => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      if (!cookie) return null;

      const token = cookie.split("=")[1];
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded.pr_id;
      } catch (err) {
        console.error("Errore nella decodifica del token:", err);
        return null;
      }
    };

    const fetchEventi = async () => {
      const pr_id = getPrIdFromCookie();
      if (!pr_id) {
        console.warn("⚠️ PR ID non trovato nel token.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/pr/storico?pr_id=${pr_id}`);
        setEventi(response.data);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventi();
  }, []);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full md:w-96 max-h-80 overflow-y-auto mt-6 md:mt-0">
      <h2 className="text-xl font-bold mb-4 text-center">Storico Eventi</h2>
      {loading ? (
        <p className="text-center text-gray-500">Caricamento...</p>
      ) : (
        <ul className="space-y-3">
          {eventi.length > 0 ? (
            eventi.map((evento) => (
              <li key={evento.id} className="p-4 border-b last:border-none bg-gray-100 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-gray-800">{evento.nomeEvento}</p>
                <p className="text-md text-gray-700">Nomi registrati: <span className="font-bold">{evento.numeroNomi}</span></p>
                <p className="text-md text-gray-600">Data: {new Date(evento.data).toLocaleDateString()}</p>
              </li>
            ))
          ) : (
            <p className="text-md text-gray-500 text-center">Nessun evento registrato.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default EventHistory;
