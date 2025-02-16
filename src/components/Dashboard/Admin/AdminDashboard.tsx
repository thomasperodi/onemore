import React from 'react';
import { LogoutButton } from '@/components/ui/LogoutButton';
export const AdminDashboard = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
      <p>Benvenuto nella dashboard dell&apos;amministratore.</p>
      {/* Aggiungi componenti per gestione eventi, liste e PR */}
        <LogoutButton />
    </div>
  );
};