import { Users } from "lucide-react";

async function getGuestCount(): Promise<{ totale_ospiti: number; ospiti_entrati: number } | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/lista-evento`, {
      cache: "no-store", // oppure 'force-cache' se vuoi caching
    });

    if (!res.ok) return null;

    const data = await res.json();
    
    // Verifica che entrambi i campi siano presenti
    return {
      totale_ospiti: data.totale_ospiti || 0  // Usa 0 se non c'è il dato
    };
  } catch {
    return null;
  }
}

const GuestCount = async () => {
  const data = await getGuestCount();

  if (!data) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Clienti in lista</h3>
          <p className="text-2xl font-bold text-gray-900">Caricamento...</p>
        </div>
      </div>
    );
  }

  const { totale_ospiti } = data;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full">
        <Users className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Clienti in lista</h3>
        <p className="text-2xl font-bold text-gray-900">
          {totale_ospiti} 
        </p>
      </div>
    </div>
  );
};

export default GuestCount;