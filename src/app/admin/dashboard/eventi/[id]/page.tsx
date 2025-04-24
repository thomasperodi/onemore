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
  data: string | number | Date;
  id: number;
  nome: string;
  locandina: string;
}

interface IngressiPerPrezzo {
  [key: number]: number;
}

const DettaglioEvento = () => {
  const params = useParams();
  const id = useMemo(() => params?.id, [params]);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [ingressiPerPrezzo, setIngressiPerPrezzo] = useState<IngressiPerPrezzo>({});
  const [caricamento, setCaricamento] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchDettagliEvento = async () => {
      try {
        const { data } = await axios.get(`/api/admin/eventi/${id}`);
        setEvento(data.evento);
        setIngressiPerPrezzo(data.ingressi_per_prezzo || {});
      } catch (error) {
        console.error("Errore nel caricamento dei dettagli dell'evento", error);
      } finally {
        setCaricamento(false);
      }
    };

    if (id) fetchDettagliEvento();
  }, [id]);

  const incassoTotale = useMemo(() => {
    return Object.entries(ingressiPerPrezzo).reduce(
      (total, [prezzo, ingressi]) => total + Number(prezzo) * ingressi,
      0
    );
  }, [ingressiPerPrezzo]);

  if (caricamento) {
    return <p className="text-center text-gray-500 text-sm mt-4">Caricamento dettagli evento...</p>;
  }

  if (!evento) {
    return <p className="text-center text-red-500 text-sm mt-4">Evento non trovato.</p>;
  }

  return (
    <AdminDashboardLayout>
      <div className="w-full max-w-lg mx-auto px-4 mb-20">
        <Card className="shadow-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">{evento.nome}</h1>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            {/* Locandina */}
            <Image
              src={evento.locandina}
              alt={`Locandina di ${evento.nome}`}
              width={300}
              height={450}
              className="rounded-lg shadow max-w-[70%] sm:max-w-[200px] h-auto"
              priority
            />

            {/* Tabella ingressi */}
            <div className="w-full">
              <h2 className="text-lg font-semibold text-center mb-2">Ingressi per Prezzo</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center border border-gray-300 rounded-md shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-1 px-4 border-b">Prezzo</th>
                      <th className="py-1 px-4 border-b">Ingressi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[10, 12, 15].map((prezzo) => (
                      <tr key={prezzo} className="border-b">
                        <td className="py-1 px-4">€{prezzo.toFixed(2)}</td>
                        <td className="py-1 px-4">{ingressiPerPrezzo[prezzo] ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottone */}
              <Button
                className="mt-4 w-full"
                onClick={() => setOpenDialog(true)}
              >
                Visualizza Incasso Totale
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog ShadCN */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Incasso Totale</DialogTitle>
            </DialogHeader>
            <div className="text-center text-2xl font-bold text-gray-900">
              €{incassoTotale.toFixed(2)}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
};

export default DettaglioEvento;
