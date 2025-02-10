"use client";

import { useAuth } from '@/hooks/useAuth';

export default function UserInfo() {
  const { user, logout, loading } = useAuth();

  if (loading) return <p>Caricamento...</p>;
  if (!user) return <p>Non sei autenticato</p>;

  return (
    <div>
      <p>Benvenuto, {user.name}!</p>
      <button onClick={logout} className="p-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
}
