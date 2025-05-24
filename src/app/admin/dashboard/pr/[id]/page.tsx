"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import AdminDashboardLayout from "@/components/Dashboard/Admin/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface PRDetail {
  nome: string;
  cognome: string;
  storico_eventi: {
    evento_nome: string;
    ospiti_totali: number;
    ospiti_entrati: number;
    nomi_utenti: { nome: string; cognome: string }[];
  }[];
}

const ITEMS_PER_PAGE = 5;

export default function PRPage() {
  const params = useParams();
  const [pr, setPr] = useState<PRDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventoSelezionato, setEventoSelezionato] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!params?.id) return;

    const fetchPRDetails = async () => {
      try {
        const response = await axios.get(`/api/admin/pr/storico/${params.id}`);
        setPr(response.data);
        const primoEvento = response.data?.storico_eventi[0]?.evento_nome || null;
        setEventoSelezionato(primoEvento);
      } catch {
        setError("Errore nel recupero dei dati");
      } finally {
        setLoading(false);
      }
    };

    fetchPRDetails();
  }, [params?.id]);

  const eventoCorrente = pr?.storico_eventi.find(e => e.evento_nome === eventoSelezionato);
  const nomiUtenti = eventoCorrente?.nomi_utenti || [];
  const totalPages = Math.ceil(nomiUtenti.length / ITEMS_PER_PAGE);
  const paginati = nomiUtenti.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleEventoChange = (value: string) => {
    setEventoSelezionato(value);
    setCurrentPage(1);
  };

  if (loading) return <p className="p-6 text-gray-700">Caricamento...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        {/* Intestazione */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h1 className="text-3xl font-bold text-gray-800">
            {pr?.nome} {pr?.cognome}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Storico eventi organizzati</p>
        </div>

        {/* Tabella riepilogo */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Riepilogo Eventi</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Ospiti Totali</TableHead>
                  <TableHead>Ospiti Entrati</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pr?.storico_eventi.map((evento, i) => (
                  <TableRow key={i}>
                    <TableCell>{evento.evento_nome}</TableCell>
                    <TableCell className="text-blue-600 font-semibold">{evento.ospiti_totali}</TableCell>
                    <TableCell className={`font-semibold ${evento.ospiti_entrati > 0 ? "text-green-600" : "text-red-600"}`}>
                      {evento.ospiti_entrati}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Selezione evento */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Dettaglio Nomi per Evento</h2>
          <Select value={eventoSelezionato || undefined} onValueChange={handleEventoChange}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Seleziona un evento" />
            </SelectTrigger>
            <SelectContent>
              {pr?.storico_eventi.map((e, i) => (
                <SelectItem key={i} value={e.evento_nome}>
                  {e.evento_nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tabella nomi */}
          {eventoCorrente && (
            <div className="overflow-x-auto mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cognome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginati.map((utente, i) => (
                    <TableRow key={i}>
                      <TableCell>{utente.nome}</TableCell>
                      <TableCell>{utente.cognome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginazione */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    ← Indietro
                  </Button>
                  <span className="text-gray-600">
                    Pagina {currentPage} di {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Avanti →
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
