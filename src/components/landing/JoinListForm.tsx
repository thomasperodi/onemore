"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

const LIST_CLOSURE_TIME = new Date("2025-02-12T18:00:00"); // Data di chiusura

const JoinListForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [prId, setPrId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const searchParams = useSearchParams();
  const privacyAccepted = watch("privacy");

  useEffect(() => {
    const urlPrId = searchParams.get("pr_id");
    const storedPrId = Cookies.get("pr_id");
    if (urlPrId) {
      setPrId(urlPrId);
      Cookies.set("pr_id", urlPrId, { expires: 7 }); // Salva nei cookie per 7 giorni
    } else if (storedPrId) {
      setPrId(storedPrId);
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = LIST_CLOSURE_TIME.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("La lista è chiusa");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}g ${hours}h ${minutes}m`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [searchParams]);

  interface FormData {
    nome: string;
    cognome: string;
    privacy: boolean;
  }

  const onSubmit = async (data: FormData) => {
    if (!prId) {
      alert("Errore: nessun PR di riferimento trovato.");
      return;
    }
    console.log("Dati inviati:", { ...data, prId });
    alert("Registrazione completata!");
  };

  return (
    <div id="lista" className="bg-[#f8e8ff] p-8 rounded-lg shadow-lg max-w-md mx-auto border border-[#e9aafd]">
      <h2 className="text-3xl font-semibold text-center text-[#691976] mb-4">Mettiti in Lista</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[#961bb0] font-medium">Nome</label>
          <input type="text" {...register("nome", { required: "Il nome è obbligatorio" })} className="w-full border border-[#e9aafd] p-2 rounded focus:border-[#dd78fa] focus:ring-[#dd78fa] outline-none" />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
        </div>
        <div>
          <label className="block text-[#961bb0] font-medium">Cognome</label>
          <input type="text" {...register("cognome", { required: "Il cognome è obbligatorio" })} className="w-full border border-[#e9aafd] p-2 rounded focus:border-[#dd78fa] focus:ring-[#dd78fa] outline-none" />
          {errors.cognome && <p className="text-red-500 text-sm">{errors.cognome.message}</p>}
        </div>
        <div className="flex items-center">
          <input type="checkbox" {...register("privacy", { required: "Devi accettare il trattamento dei dati" })} className="mr-2 accent-[#c634ef]" />
          <label className="text-[#961bb0]">Accetto il trattamento dei dati personali</label>
        </div>
        {errors.privacy && <p className="text-red-500 text-sm">{errors.privacy.message}</p>}
        <button type="submit" className={`w-full p-2 rounded text-white ${privacyAccepted ? "bg-[#c634ef] hover:bg-[#b125d4]" : "bg-gray-400 cursor-not-allowed"}`} disabled={!privacyAccepted}>Invia</button>
      </form>
      <p className="text-center pt-4 text-[#b125d4] font-medium mb-4">La lista chiude tra: <span className="font-bold">{timeLeft}</span></p>
    </div>
  );
};

export default JoinListForm;
