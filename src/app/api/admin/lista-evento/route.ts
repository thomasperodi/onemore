import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Recupera tutti gli eventi attivi con nome o altri dati se ti servono
  const { data: eventiAttivi, error: eventError } = await supabase
    .from("eventi")
    .select("id, nome") // aggiungi altri campi se vuoi
    .eq("attivo", true);

  if (eventError || !eventiAttivi || eventiAttivi.length === 0) {
    return NextResponse.json(
      { error: "Nessun evento attivo trovato" },
      { status: 400 }
    );
  }

  // Crea una lista di promesse per ogni evento attivo
  const risultati = await Promise.all(
    eventiAttivi.map(async (evento) => {
      const { count: totaleOspiti } = await supabase
        .from("lista")
        .select("id", { count: "exact", head: true })
        .eq("evento_id", evento.id);

      const { count: ospitiEntrati } = await supabase
        .from("lista")
        .select("id", { count: "exact", head: true })
        .eq("evento_id", evento.id)
        .eq("ingresso", true);

      return {
        evento_id: evento.id,
        nome: evento.nome,
        totale_ospiti: totaleOspiti ?? 0,
        ospiti_entrati: ospitiEntrati ?? 0,
      };
    })
  );

  return NextResponse.json(risultati, { status: 200 });
}
