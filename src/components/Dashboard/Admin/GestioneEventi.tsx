"use client";

import { useState } from "react";
import axios from "axios";
import { PlusCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const GestioneEventi = () => {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [locandina, setLocandina] = useState<File | null>(null);
  const [indirizzo, setIndirizzo] = useState("");
  const [modalitaCalcolo, setModalitaCalcolo] = useState("Paradise");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddEvento = async () => {
    setError(null);
    setSuccess(null);

    if (!nome.trim() || !data || !locandina || !indirizzo.trim() || !modalitaCalcolo) {
      setError("Compila tutti i campi.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", locandina);

      const uploadResponse = await axios.post("/api/admin/eventi/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const locandinaUrl = uploadResponse.data.fileUrl;

      await axios.post("/api/admin/eventi", {
        nome: nome.trim(),
        data,
        locandina: locandinaUrl,
        indirizzo: indirizzo.trim(),
        modalita_calcolo: modalitaCalcolo,
      });

      setSuccess("Evento aggiunto con successo 🎉");
      setNome("");
      setData("");
      setIndirizzo("");
      setLocandina(null);
      setModalitaCalcolo("Paradise");

      setTimeout(() => setSuccess(null), 5000);
    } catch {
      setError("Errore durante l'aggiunta dell'evento. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-4">
      <CardHeader className="text-center text-lg font-semibold">Aggiungi Evento</CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Nome evento"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <Input
          placeholder="Indirizzo evento"
          value={indirizzo}
          onChange={(e) => setIndirizzo(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setLocandina(e.target.files ? e.target.files[0] : null)}
        />

        <div className="col-span-full">
          <Label className="block mb-1">Modalità di Calcolo</Label>
          <select
            value={modalitaCalcolo}
            onChange={(e) => setModalitaCalcolo(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="Paradise">Paradise</option>
            <option value="Cala More">Cala More</option>
          </select>
        </div>

        <Button
          className="col-span-full"
          onClick={handleAddEvento}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          {loading ? "Aggiungendo..." : "Aggiungi Evento"}
        </Button>

        {error && (
          <Alert variant="destructive" className="col-span-full">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="col-span-full">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default GestioneEventi;
