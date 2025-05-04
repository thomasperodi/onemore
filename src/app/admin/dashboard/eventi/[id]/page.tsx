"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import AdminDashboardLayout from "@/components/Dashboard/Admin/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Evento {
  id: number;
  nome: string;
  locandina: string;
  modalita_calcolo: string;
}

interface Statistiche {
  in_lista_pre_21?: number;
  in_lista_post_21?: number;
  in_lista?: number;
  fuori_lista: number;
  incasso_totale: number;
}

const DettaglioEvento = () => {
  const params = useParams();
  const id = useMemo(() => params?.id, [params]);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [statistiche, setStatistiche] = useState<Statistiche | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchDati = async () => {
      try {
        const { data } = await axios.get(`/api/admin/eventi/${id}`);
        setEvento(data.evento);
        setStatistiche(data.statistiche);
      } catch (error) {
        console.error("Errore caricamento dettagli evento:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDati();
  }, [id]);

  if (loading) {
    return <p className="text-center text-sm text-gray-500 mt-4">Caricamento...</p>;
  }

  if (!evento || !statistiche) {
    return <p className="text-center text-sm text-red-500 mt-4">Evento non trovato.</p>;
  }

  return (
    <AdminDashboardLayout>
      <div className="w-full max-w-lg mx-auto px-4 mb-20">
        <Card className="shadow-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">{evento.nome}</h1>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            <Image
              src={evento.locandina}
              alt={`Locandina di ${evento.nome}`}
              width={300}
              height={450}
              className="rounded-lg shadow max-w-[70%] sm:max-w-[200px] h-auto"
              priority
            />

            <div className="w-full mt-4">
              <h2 className="text-lg font-semibold text-center mb-2">Statistiche Ingressi</h2>

              <table className="min-w-full text-sm text-center border border-gray-300 rounded-md shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-1 px-4 border-b">Tipo</th>
                    <th className="py-1 px-4 border-b">Numero</th>
                  </tr>
                </thead>
                <tbody>
                  {evento.modalita_calcolo === "cala_more" ? (
                    <>
                      <tr><td className="py-1 px-4">In lista (prima delle 21)</td><td>{statistiche.in_lista_pre_21 ?? 0}</td></tr>
                      <tr><td className="py-1 px-4">In lista (dopo le 21)</td><td>{statistiche.in_lista_post_21 ?? 0}</td></tr>
                    </>
                  ) : (
                    <tr><td className="py-1 px-4">In lista</td><td>{statistiche.in_lista ?? 0}</td></tr>
                  )}
                  <tr><td className="py-1 px-4">Fuori lista</td><td>{statistiche.fuori_lista}</td></tr>
                </tbody>
              </table>

              <Button onClick={() => setOpenDialog(true)} className="mt-4 w-full">
                Visualizza Incasso Totale
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Incasso Totale</DialogTitle>
            </DialogHeader>
            <div className="text-center text-2xl font-bold text-gray-900">
              €{statistiche.incasso_totale.toFixed(2)}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
};

export default DettaglioEvento;
