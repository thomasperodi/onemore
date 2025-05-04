'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

interface EventFormProps {
  eventoId: string;
}

const EventForm: React.FC<EventFormProps> = ({ eventoId }) => {
  const [formData, setFormData] = useState({ nome: '', cognome: '' });
  const [consenso, setConsenso] = useState(false);
  const [prId, setPrId] = useState<string | null>(null);
  const [listaChiusa, setListaChiusa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text:string, type:'success'|'error'}|null>(null);
  const searchParams = useSearchParams();

  // Gestione pr_id e stato lista chiusa...
  useEffect(() => {
    const urlPrId = searchParams.get('pr_id');
    if (urlPrId) {
      setPrId(urlPrId);
      Cookies.set('pr_id', urlPrId, { expires: 1 });
    } else {
      const stored = Cookies.get('pr_id') || 'c235d718-3c9b-46ef-80b2-503c91880851';
      setPrId(stored);
      Cookies.set('pr_id', stored, { expires: 1 });
    }

    // Controlla se la lista è chiusa in base alla data dell'evento
    fetch(`/api/active-event/${eventoId}`)
      .then(r => r.json())
      .then(data => {
        if (new Date(data.data).getTime() <= Date.now()) {
          setListaChiusa(true);
        }
      })
      .catch(console.error);
  }, [eventoId, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (listaChiusa) return setMessage({ text: 'La lista è chiusa, non puoi più registrarti.', type: 'error' });
    if (!consenso)    return setMessage({ text: 'Devi accettare il trattamento dei dati personali.', type: 'error' });
    if (!prId)        return setMessage({ text: 'Errore: nessun PR di riferimento trovato.', type: 'error' });

    setLoading(true);
    try {
      const res = await fetch('/api/join-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, prId, eventoId }),
      });
      if (res.ok) {
        setMessage({ text: 'Ti sei inserito in lista correttamente!', type: 'success' });
        setFormData({ nome:'', cognome:'' });
        setConsenso(false);
      } else if (res.status === 409) {
        setMessage({ text: 'Nome già in lista.', type:'error' });
      } else {
        setMessage({ text: 'Errore durante la registrazione', type:'error' });
      }
    } catch {
      setMessage({ text: 'Si è verificato un errore imprevisto. Riprova più tardi.', type:'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-white ${message.type==='success'?'bg-green-500':'bg-red-500'}`}>
          {message.text}
        </div>
      )}
      <input name="nome" placeholder="Nome" required value={formData.nome}
        onChange={e => setFormData({ ...formData, nome: e.target.value })}
        disabled={listaChiusa||loading}
        className="w-full bg-white text-black placeholder-gray-500 border rounded px-4 py-3 focus:ring-2 focus:ring-pink-500"
      />
      <input name="cognome" placeholder="Cognome" required value={formData.cognome}
        onChange={e => setFormData({ ...formData, cognome: e.target.value })}
        disabled={listaChiusa||loading}
        className="w-full bg-white text-black placeholder-gray-500 border rounded px-4 py-3 focus:ring-2 focus:ring-pink-500"
      />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={consenso} onChange={() => setConsenso(!consenso)} disabled={listaChiusa||loading} className="accent-pink-600" />
        <span className="text-sm text-white">Accetto il trattamento dei dati personali</span>
      </label>
      <button type="submit"
        disabled={listaChiusa||loading}
        className={`w-full py-3 rounded-lg text-lg shadow-md transition ${listaChiusa?'bg-gray-500':'bg-pink-600 hover:bg-pink-700'} text-white`}
      >
        {loading
          ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          : listaChiusa
            ? 'Lista Chiusa'
            : 'Inserisciti in Lista'
        }
      </button>
    </form>
  );
};

export default EventForm;
