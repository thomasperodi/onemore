"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  pr_id?: string;
}

const CurrentEventCount = () => {
  const [currentEventCount, setCurrentEventCount] = useState(0);
  const [nome_evento, setNome_evento] = useState<string>("");
  useEffect(() => {
    const getPrIdFromToken = (): string | null => {
      try {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((row) => row.startsWith("token="));
        if (!tokenCookie) return null;

        const token = tokenCookie.split("=")[1];
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded.pr_id || null;
      } catch (error) {
        console.error("Errore nella decodifica del token:", error);
        return null;
      }
    };
    const GetNameEvent = async () => {
      try {
        const res = await fetch("/api/active-event");
        const data = await res.json();
        setNome_evento(data[0].nome);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };

    const fetchCurrentEventCount = async () => {
      const pr_id = getPrIdFromToken();
      if (!pr_id) {
        console.warn("PR ID non trovato nel token.");
        return;
      }

      try {
        const res = await fetch(`/api/pr/list/current?pr_id=${pr_id}`);
        const data = await res.json();
        setCurrentEventCount(data.count);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };
    GetNameEvent();
    fetchCurrentEventCount();
  }, []);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-4">
          Persone in lista per {nome_evento}
        </h3>
        <p className="text-4xl font-bold">{currentEventCount}</p>
      </div>
    </div>
  );
};

export default CurrentEventCount;
