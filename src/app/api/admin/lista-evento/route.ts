import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // 🔍 Recupera evento attivo
  const { data: eventoAttuale, error: eventError } = await supabase
    .from("eventi")
    .select("id")
    .eq("attivo", true)
    .single();

  if (eventError || !eventoAttuale) {
    return NextResponse.json(
      { error: "Nessun evento attivo trovato" },
      { status: 400 }
    );
  }

  const eventoId = eventoAttuale.id;

  // 📊 Conta ospiti totali
  const { count: totaleOspiti, error: totalError } = await supabase
    .from("lista")
    .select("id", { count: "exact", head: true })
    .eq("evento_id", eventoId);

  // 📊 Conta ospiti entrati
  const { count: ospitiEntrati, error: ingressoError } = await supabase
    .from("lista")
    .select("id", { count: "exact", head: true })
    .eq("evento_id", eventoId)
    .eq("ingresso", true);

  if (totalError || ingressoError) {
    return NextResponse.json(
      { error: "Errore nel conteggio degli ospiti" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      evento_id: eventoId,
      totale_ospiti: totaleOspiti,
      ospiti_entrati: ospitiEntrati,
    },
    { status: 200 }
  );
}
