import { Users } from "lucide-react";

type Evento = {
  evento_id: number;
  nome: string;
  totale_ospiti: number;
  ospiti_entrati: number;
};

async function getGuestCounts(): Promise<Evento[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/lista-evento`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Response not OK");
    const data = await res.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Errore fetch lista eventi:", error);
    return [];
  }
}

const GuestCount = async () => {
  const eventi = await getGuestCounts();

  return (
    <div className="grid gap-4">
      {eventi.length > 0 ? (
        eventi.map((evento) => (
          <div
            key={evento.evento_id}
            className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4"
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Evento - {evento.nome}
              </h3>
              <div>
        <h3 className="text-lg font-normal text-gray-700">Clienti in lista</h3>
        <p className="text-2xl font-bold text-gray-900">
          {evento.totale_ospiti > 0 ? evento.totale_ospiti : "Nessuno"}
        </p>
      </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Nessun evento attivo trovato</p>
      )}
    </div>
  );
};

export default GuestCount;
