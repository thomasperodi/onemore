"use client"
import EventCard from "@/components/Lista/EventCard";
import Navbar from "@/components/landing/Navbar";


const ListaPage = () => {
  
  return (
    <main className="space-y-0">
        <Navbar />
        <div className="py-12" />
        <EventCard /> 
        <div className="py-12" />
    </main>
  );
};

export default ListaPage;
