"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify"; // Importa react-toastify
import "react-toastify/dist/ReactToastify.css"; // Importa il CSS per il toast

interface Evento {
  locandina: string;
  id: number;
  nome: string;
  persone_in_lista: number;
  ingressi_effettivi: number;
  data: string;
  attivo: boolean;
  indirizzo: string;
}

const ListaEventi = () => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalePagine, setTotalePagine] = useState(1);
  const [caricamento, setCaricamento] = useState(true);
  const [modificaEvento, setModificaEvento] = useState<Evento | null>(null);
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [attivo, setAttivo] = useState(false);
  const [locandina, setLocandina] = useState<File | null>(null);
  const [caricamentoModifica, setCaricamentoModifica] = useState(false);
  const perPagina = 4;
  const router = useRouter();

  const handleElimina = async (id: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questo evento?")) {
      try {
        const response = await axios.delete(`/api/admin/eventi`, {
          data: { id },
        });
        toast.success(response.data.message); // Toast di successo
        fetchEventi();
      } catch (error) {
        console.error("Errore nell'eliminazione", error);
        toast.error("Errore nell'eliminazione dell'evento"); // Toast di errore
      }
    }
  };

  const fetchEventi = useCallback(async () => {
    try {
      setCaricamento(true);
      const response = await axios.get(`/api/admin/eventi?page=${pagina}&limit=${perPagina}`);
      setEventi(response.data.eventi);
      setTotalePagine(response.data.totalePagine);
    } catch (error) {
      console.error("Errore nel caricamento eventi", error);
    } finally {
      setCaricamento(false);
    }
  }, [pagina]);

  useEffect(() => {
    fetchEventi();
  }, [fetchEventi]);

  const handleModifica = async () => {
    if (modificaEvento) {
      setCaricamentoModifica(true);
      try {
        const dataToSend = {
          id: String(modificaEvento.id),
          nome: nome,
          data: data,
          attivo: attivo,
          indirizzo: indirizzo,
          locandina: locandina ? locandina.name : "",
        };

        const response = await axios.put(`/api/admin/eventi`, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.message) {
          toast.success(response.data.message); // Toast di successo
        } else {
          throw new Error("Errore: nessun messaggio ricevuto");
        }

        setModificaEvento(null);
        setNome("");
        setData("");
        setIndirizzo("");
        setAttivo(false);
        setLocandina(null);
        fetchEventi();
      } catch (error) {
        console.error("Errore nel salvataggio", error);
        toast.error("Errore nel salvataggio delle modifiche"); // Toast di errore
      } finally {
        setCaricamentoModifica(false);
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} />
      <Card className="w-full max-w-4xl mx-auto mb-4">
        <CardHeader className="text-center text-xl font-semibold">Lista Eventi</CardHeader>
        <CardContent>
          {caricamento ? (
            <div className="space-y-2 animate-pulse">
              {[...Array(perPagina)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border text-sm text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Nome Evento</th>
                    <th className="p-2">In Lista</th>
                    <th className="p-2">Entrati</th>
                    <th className="p-2">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {eventi.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-3 text-gray-500">Nessun evento disponibile</td>
                    </tr>
                  ) : (
                    eventi.map((evento) => (
                      <tr key={evento.id} className="border-t">
                        <td className="p-2">{evento.nome}</td>
                        <td className="p-2">{evento.persone_in_lista}</td>
                        <td className="p-2">{evento.ingressi_effettivi}</td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            className="bg-blue-500 text-white"
                            onClick={() => router.push(`/admin/dashboard/eventi/${evento.id}`)}
                          >
                            Info
                          </Button>
                          <Button
                            size="sm"
                            className="ml-2"
                            onClick={() => {
                              setModificaEvento(evento);
                              setNome(evento.nome);
                              setData(evento.data);
                              setIndirizzo(evento.indirizzo);
                              setAttivo(evento.attivo);
                            }}
                          >
                            Modifica
                          </Button>
                          <Button
                            size="sm"
                            className="ml-2 bg-red-500 text-white"
                            onClick={() => handleElimina(evento.id)}
                          >
                            Elimina
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalePagine > 1 && (
            <div className="flex justify-center gap-2 mt-4 text-sm">
              <Button
                variant="outline"
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
              >
                ← Precedente
              </Button>
              <span className="self-center">Pagina {pagina} di {totalePagine}</span>
              <Button
                variant="outline"
                disabled={pagina === totalePagine}
                onClick={() => setPagina(pagina + 1)}
              >
                Successivo →
              </Button>
            </div>
          )}
        </CardContent>

        {/* Dialog per modificare evento */}
        <Dialog open={modificaEvento !== null} onOpenChange={(open) => { if (!open) setModificaEvento(null) }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifica Evento</DialogTitle>
              <DialogDescription>
                Modifica i dettagli dell&apos;evento qui sotto.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">Nome Evento</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome dell'evento"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="data" className="text-right">Data Evento</Label>
                <Input
                  id="data"
                  type="datetime-local"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="indirizzo" className="text-right">Indirizzo</Label>
                <Input
                  id="indirizzo"
                  value={indirizzo}
                  onChange={(e) => setIndirizzo(e.target.value)}
                  placeholder="Indirizzo dell'evento"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModificaEvento(null)}>
                Annulla
              </Button>
              <Button onClick={handleModifica} disabled={caricamentoModifica}>
                {caricamentoModifica ? "Caricamento..." : "Salva Modifiche"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
};

export default ListaEventi;
