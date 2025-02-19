import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Recuperare il numero totale di ospiti per l'evento attivo
export async function GET() {
  const { data: eventoAttuale, error: eventError } = await supabase
    .from("eventi")
    .select("id")
    .eq("attivo", true)
    .single();

  if (eventError || !eventoAttuale) {
    return NextResponse.json({ error: "Nessun evento attivo trovato" }, { status: 400 });
  }

  const { data: ospiti, error: listError } = await supabase
    .from("lista")
    .select("id")
    .eq("evento_id", eventoAttuale.id);

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 400 });
  }

  return NextResponse.json({ count: ospiti.length }, { status: 200 });
}
