
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Evento {
  id: number;
  nome: string;
  persone_in_lista: number;
  ingressi_effettivi: number;
}

const ListaEventi = () => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalePagine, setTotalePagine] = useState(1);
  const [caricamento, setCaricamento] = useState(true);
  const perPagina = 5;
  const router = useRouter();

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

  return (
    <Card className="w-full max-w-5xl mx-auto">
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
            <table className="w-full border text-sm text-center">
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
                          onClick={() => router.push(`/admin/dashboard/eventi/${evento.id}`)}
                        >
                          Info
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
    </Card>
  );
};

export default ListaEventi;
