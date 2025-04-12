"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const LoginPR = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (attempts >= 3) {
      setError("Troppi tentativi. Attendi qualche secondo prima di riprovare.");
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Username o password errati. Riprova o reimposta la password.");
        setAttempts(attempts + 1);
        return;
      }

      const dashboardPath = data.role === 'admin' ? '/admin/dashboard' : '/pr/dashboard';
      router.push(dashboardPath);
    } catch {
      setError("Errore di connessione. Controlla la tua rete e riprova.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#44034f] to-[#7c1890] text-white p-4">
      <div className="bg-white text-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up space-y-6">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-800">
          Accedi come PR
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className={`w-full p-4 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-4 focus:ring-violet-500 transition`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className={`w-full p-4 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-4 focus:ring-violet-500 transition`} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 hover:text-gray-800">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm text-center animate-shake">{error}</p>}
          {error && (
            <div className="text-center">
              <Link href="/auth/reset-password" className="text-violet-600 hover:underline text-sm">
                Hai dimenticato la password?
              </Link>
            </div>
          )}
          <button
            type="submit"
            className={`w-full ${
              attempts >= 3 ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-violet-600 to-violet-800 hover:scale-105"
            } text-white py-3 rounded-lg transition duration-300 shadow-lg`}
            disabled={attempts >= 3}
          >
            Accedi
          </button>
        </form>
        <p className="text-center text-sm mt-6">Non hai un account? <Link href="/auth/register" className="text-violet-600 hover:underline">Registrati</Link></p>
      </div>
    </section>
  );
};
