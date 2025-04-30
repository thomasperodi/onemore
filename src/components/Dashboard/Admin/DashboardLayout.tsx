"use client";

import React, { useState, useEffect } from "react";
import { Home, List, Users, CalendarDays, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  nome?: string;
}

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((row) => row.startsWith("token="));
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];
          const decoded = jwtDecode<CustomJwtPayload>(token);
          setNome(decoded.nome || "");
        }
      } catch (error) {
        console.error("Errore nella decodifica del token:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  const menuItems = [
    { name: "Home", href: "/admin/dashboard", icon: <Home size={22} /> },
    { name: "Lista", href: "/admin/dashboard/list", icon: <List size={22} /> },
    { name: "Gestione PR", href: "/admin/dashboard/pr", icon: <Users size={22} /> },
    { name: "Gestione Eventi", href: "/admin/dashboard/eventi", icon: <CalendarDays size={22} /> },
  ];

  return (
    <div className="h-screen flex">
      {/* Sidebar desktop */}
      <aside className="h-full w-64 bg-gradient-to-br from-blue-700 to-blue-900 text-white flex-col p-6 shadow-2xl hidden md:flex">
        <h2 className="text-3xl font-extrabold mb-8 text-center">Dashboard</h2>
        <nav className="flex flex-col gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded-xl transition"
            >
              {item.icon} {item.name}
            </Link>
          ))}
          {/* Bottone di logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 hover:bg-red-700 rounded-xl transition mt-auto text-left w-full"
          >
            <LogOut size={22} /> Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="flex items-center justify-between p-4 bg-gray-800 text-white w-full">
          <h1 className="text-xl font-bold">Benvenuto {nome}</h1>
          <button className="p-2 text-white bg-blue-600 rounded-full md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>
        </nav>

        {/* Overlay per mobile */}
        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}

        {/* Sidebar mobile */}
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-blue-700 to-blue-900 text-white flex flex-col p-6 shadow-2xl z-50 md:hidden"
        >
          <nav className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded-xl transition"
                onClick={() => setIsOpen(false)}
              >
                {item.icon} {item.name}
              </Link>
            ))}
            {/* Bottone di logout per mobile */}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 p-3 hover:bg-red-700 rounded-xl transition text-left w-full"
            >
              <LogOut size={22} /> Logout
            </button>
          </nav>
        </motion.aside>

        {/* Contenuto della dashboard */}
        <div className="p-4 flex-1 overflow-y-auto md:flex-row md:items-start md:gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
