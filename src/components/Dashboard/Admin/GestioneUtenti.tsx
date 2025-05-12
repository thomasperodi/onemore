"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

interface Utente {
  id: string;
  nome: string;
  cognome: string;
  username: string;
  password: string;
  ruolo: string;
}

const ELEMENTI_PER_PAGINA = 5;

export const GestioneUtenti: React.FC = () => {
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser] = useState<Utente | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    fetchUtenti();
  }, []);

  const fetchUtenti = async () => {
    try {
      const response = await fetch("/api/admin/utenti");
      if (!response.ok) throw new Error("Errore nella richiesta");
      const data = await response.json();
      setUtenti(data);
    } catch (error) {
      console.error("Errore nel recupero degli utenti:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;
    try {
      const res = await fetch("/api/admin/utenti", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setUtenti((prev) => prev.filter((u) => u.id !== id));
      toast.success("Utente eliminato con successo");
    } catch {
      console.error("Errore nell'eliminazione dell'utente");
      toast.error("Errore durante l'eliminazione dell'utente");
    }
  };

  const openEditDialog = (utente: Utente) => {
    setEditUser(utente);
    setEditUsername(utente.username);
    setEditPassword("");
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      const res = await fetch("/api/admin/utenti", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editUser.id,
          username: editUsername,
          password: editPassword || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      await fetchUtenti();
      setEditUser(null);
      toast.success("Utente aggiornato con successo");
    } catch {
      console.error("Errore nell'aggiornamento dell'utente");
      toast.error("Errore durante l'aggiornamento dell'utente");
    }
  };

  const utentiFiltrati = utenti.filter((utente) =>
    `${utente.nome} ${utente.cognome}`.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ELEMENTI_PER_PAGINA;
  const utentiVisibili = utentiFiltrati.slice(startIndex, startIndex + ELEMENTI_PER_PAGINA);
  const totalePagine = Math.ceil(utentiFiltrati.length / ELEMENTI_PER_PAGINA);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-semibold text-center">Gestione Utenti</h1>

      <Input
        type="text"
        placeholder="Cerca per nome o cognome..."
        value={search}
        onChange={handleSearchChange}
      />

      <Table>
        <TableCaption>Lista Utenti</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-center">Username</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {utentiVisibili.map((utente) => (
            <TableRow key={utente.id}>
              <TableCell>{utente.nome} {utente.cognome}</TableCell>
              <TableCell className="text-center">{utente.username}</TableCell>
              <TableCell className="flex justify-end gap-3">
                <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(utente.id)}>
                  <Trash2 className="text-red-500" size={20} />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(utente)}>
                      <Edit className="text-blue-500" size={20} />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginazione */}
      {totalePagine > 1 && (
        <div className="flex justify-between items-center pt-2">
          <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Precedente
          </Button>
          <span className="text-sm">Pagina {currentPage} di {totalePagine}</span>
          <Button onClick={() => setCurrentPage((p) => Math.min(totalePagine, p + 1))} disabled={currentPage === totalePagine}>
            Successiva
          </Button>
        </div>
      )}

      {/* Modale modifica */}
      {editUser && (
        <Dialog open={true} onOpenChange={() => setEditUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Modifica utente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Nuova Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditUser(null)}>
                Annulla
              </Button>
              <Button onClick={handleUpdateUser}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default GestioneUtenti;
