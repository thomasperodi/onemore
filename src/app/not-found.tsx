// app/not-found.tsx (se usi il file routing di Next.js 13+)
// oppure pages/404.tsx (se usi la struttura classica)

"use client";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const NotFoundPage = () => {
  return (
  <>
    <Navbar/>
    <title>Onemoreadnfam; 404 - Pagina non trovata</title>
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white px-4 py-10">
      
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops! Pagina non trovata</h1>
      <p className="text-gray-600 max-w-md mb-6">
        Forse il party si è spostato da un&apos;altra parte 🎉<br />Torna alla home e continua a organizzare momenti indimenticabili!
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Torna alla Home
      </Link>
    </div>
    <Footer/>
    </>
  );
};

export default NotFoundPage;
