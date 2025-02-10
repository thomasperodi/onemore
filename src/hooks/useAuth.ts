"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, login, logout } from '@/lib/api';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const fetchedUser = await getUser();
      setUser(fetchedUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const loggedInUser = await login(email, password);
    setUser(loggedInUser);
    setLoading(false);
    router.push('/dashboard'); // Redirect to dashboard after login
  };

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setUser(null);
    setLoading(false);
    router.push('/'); // Redirect to home after logout
  };

  return { user, loading, login: handleLogin, logout: handleLogout };
}
