"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

export const RegisterPR = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({ nome: "", cognome: "", username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string }>({ type: null, text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Le password non corrispondono" });
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/register", { ...formData, password });
      setMessage({ type: "success", text: "Registrazione avvenuta con successo!" });
      setFormData({ nome: "", cognome: "", username: "", email: "" });
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage({ type: "error", text: "Errore durante la registrazione" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-[#44034f] to-[#7c1890] text-white p-4">
      <div className="bg-white text-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-800">Registrazione PR</h2>
        {message.type && (
          <div className={`text-center p-3 rounded-lg text-white ${message.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
            {message.text}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-500 transition" required />
          <input type="text" name="cognome" placeholder="Cognome" value={formData.cognome} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-500 transition" required />
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-500 transition" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-500 transition" required />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-500 transition" required />
            <button type="button" className="absolute right-4 top-4" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Conferma Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-500 transition" required />
            <button type="button" className="absolute right-4 top-4" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-violet-800 text-white py-3 rounded-lg hover:scale-105 transition duration-300 shadow-lg flex items-center justify-center">
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Registrati"}
          </button>
        </form>
        <p className="text-center text-sm mt-6">Hai già un account? <Link href="/auth/login" className="text-violet-600 hover:underline">Accedi</Link></p>
      </div>
    </section>
  );
};
