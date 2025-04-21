// components/Dashboard/Admin/GuestCount.tsx
import { Users } from "lucide-react";

async function getGuestCount(): Promise<number | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/lista-evento`, {
      cache: "no-store", // oppure 'force-cache' se vuoi caching
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.count;
  } catch {
    return null;
  }
}

const GuestCount = async () => {
  const count = await getGuestCount();

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full">
        <Users className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Clienti in lista</h3>
        <p className="text-2xl font-bold text-gray-900">{count ?? "..."}</p>
      </div>
    </div>
  );
};

export default GuestCount;
