"use client";

import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { CheckCircle, XCircle } from "lucide-react";

interface CustomJwtPayload extends JwtPayload {
  pr_id?: string;
}

interface ListEntry {
  id: number;
  nome_utente: string;
  cognome_utente: string;
  ingresso: boolean;
}

interface Evento {
  id: number;
  nome: string;
}

const PRListTable = () => {
  const [listEntries, setListEntries] = useState<ListEntry[]>([]);
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [eventoSelezionato, setEventoSelezionato] = useState<Evento | null>(null);
  const [prId, setPrId] = useState<string | null>(null);

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

  const fetchEventiAttivi = async () => {
    try {
      const res = await fetch("/api/active-event");
      const data: Evento[] = await res.json();
      setEventi(data);
      if (data.length > 0) setEventoSelezionato(data[0]);
    } catch (error) {
      console.error("Errore nel recupero degli eventi attivi:", error);
    }
  };

  const fetchPRList = async (eventoId: number, pr_id: string) => {
    try {
      const res = await fetch(`/api/pr/list?evento_id=${eventoId}&pr_id=${pr_id}`);
      const data = await res.json();
      setListEntries(data || []);
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
    }
  };

  useEffect(() => {
    const id = getPrIdFromToken();
    setPrId(id);
    fetchEventiAttivi();
  }, []);

  useEffect(() => {
    if (eventoSelezionato && prId) {
      fetchPRList(eventoSelezionato.id, prId);
    }
  }, [eventoSelezionato, prId]);

  const columns = [
    {
      accessorKey: "nome_utente",
      header: "Nome",
    },
    {
      accessorKey: "cognome_utente",
      header: "Cognome",
    },
    {
      accessorKey: "ingresso",
      header: "Ingresso",
      cell: ({ getValue }: { getValue: () => boolean }) =>
        getValue() ? (
          <CheckCircle className="text-green-500" size={20} />
        ) : (
          <XCircle className="text-red-500" size={20} />
        ),
    },
  ];

  const table = useReactTable({
    data: listEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg w-full max-w-4xl mx-auto overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Lista - {eventoSelezionato?.nome || "Seleziona un evento"}
      </h2>

      {eventi.length > 1 && (
        <div className="mb-4">
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={eventoSelezionato?.id || ""}
            onChange={(e) =>
              setEventoSelezionato(
                eventi.find((ev) => ev.id === Number(e.target.value)) || null
              )
            }
          >
            {eventi.map((evento) => (
              <option key={evento.id} value={evento.id}>
                {evento.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-lg">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 border cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <FaSortDown className="inline ml-1" />
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-4 py-2 bg-gray-300 rounded">
          Precedente
        </button>
        <span>Pagina {table.getState().pagination.pageIndex + 1} di {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-4 py-2 bg-gray-300 rounded">
          Successivo
        </button>
      </div>
    </div>
  );
};

export default PRListTable;
