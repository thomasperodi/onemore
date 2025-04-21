// components/Dashboard/Admin/EventHistory.tsx
import Link from "next/link";
import { Calendar } from "lucide-react";

interface Event {
  id: number;
  nome: string;
  data: string;
  ospiti: number;
}

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/eventi-passati`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

const EventHistory = async () => {
  const eventi = await getEvents();

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
        <Calendar className="w-6 h-6 mr-2 text-gray-600" />
        Storico Eventi
      </h3>

      {eventi.length === 0 ? (
        <p className="text-gray-500 text-sm mt-2">Nessun evento passato disponibile</p>
      ) : (
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventi.map((evento) => (
              <Link
                key={evento.id}
                href={`/admin/dashboard/eventi/${evento.id}`}
                className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md hover:bg-gray-100 block"
              >
                <h4 className="text-lg font-bold text-gray-800">{evento.nome}</h4>
                <p className="text-gray-500 text-sm">
                  {new Date(evento.data).toLocaleDateString()}
                </p>
                <p className="mt-2 text-blue-600 font-semibold text-lg">
                  {evento.ospiti} {evento.ospiti === 1 ? "ospite" : "ospiti"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHistory;
