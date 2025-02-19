import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("pr")
    .select("id, nome, cognome, lista(id)");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const prHistory = data
    .map((pr) => ({
      id: pr.id,
      nome: pr.nome,
      cognome: pr.cognome,
      totale_ospiti: pr.lista ? pr.lista.length : 0,
    }))
    .sort((a, b) => b.totale_ospiti - a.totale_ospiti); // Ordinamento decrescente

  return NextResponse.json(prHistory, { status: 200 });
}
