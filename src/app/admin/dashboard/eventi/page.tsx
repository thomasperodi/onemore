"use client";
import AdminDashboardLayout from '@/components/Dashboard/Admin/DashboardLayout';
import GestioneEventi from '@/components/Dashboard/Admin/GestioneEventi';
import ListaEventi from '@/components/Dashboard/Admin/ListaEventi';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const AdminDashboardComponent = () => {
  // Stato per gestire la selezione dell'operazione (lista eventi o gestione eventi)
  const [selectedView, setSelectedView] = useState<'lista' | 'gestione'>('lista');

  // Funzione per cambiare la vista
  const toggleView = (view: 'lista' | 'gestione') => {
    setSelectedView(view);
  };

  return (
    <main className="min-h-screen flex flex-col space-y-6">
      <AdminDashboardLayout>
        {/* Bottone per selezionare la vista */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Button
            onClick={() => toggleView('lista')}
            variant={selectedView === 'lista' ? 'default' : 'outline'}
            className="w-full sm:w-auto"
          >
            Visualizza Eventi
          </Button>
          <Button
            onClick={() => toggleView('gestione')}
            variant={selectedView === 'gestione' ? 'default' : 'outline'}
            className="w-full sm:w-auto"
          >
            Aggiungi Eventi
          </Button>
        </div>

        {/* Mostra il componente in base alla vista selezionata */}
        {selectedView === 'lista' && <ListaEventi />}
        {selectedView === 'gestione' && <GestioneEventi />}
      </AdminDashboardLayout>
    </main>
  );
};

export default AdminDashboardComponent;
