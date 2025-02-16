"use client"
import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Errore durante il logout', error);
    }
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
      Logout
    </button>
  );
};
