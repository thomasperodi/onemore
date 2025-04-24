import { Users } from "lucide-react";

async function getGuestCount(): Promise<{ totale_ospiti: number }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/lista-evento`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Response not OK");
    const data = await res.json();

    return {
      totale_ospiti: data?.totale_ospiti ?? 0,
    };
  } catch (error) {
    console.error("Errore fetch totale ospiti:", error);
    return { totale_ospiti: 0 };
  }
}

const GuestCount = async () => {
  const { totale_ospiti } = await getGuestCount();

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full">
        <Users className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Clienti in lista</h3>
        <p className="text-2xl font-bold text-gray-900">
          {totale_ospiti > 0 ? totale_ospiti : "Nessuno"}
        </p>
      </div>
    </div>
  );
};

export default GuestCount;
