import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pr_id = searchParams.get("pr_id");

  console.log("▶️ Richiesta GET storico PR:", pr_id);

  if (!pr_id) {
    return NextResponse.json({ error: "ID PR mancante" }, { status: 400 });
  }

  const { data: eventi, error: eventiError } = await supabase
    .from("eventi")
    .select("id, nome, data")
    .lt("data", new Date().toISOString())
    .order("data", { ascending: false });

  if (eventiError) {
    console.error("❌ Errore recupero eventi:", eventiError.message);
    return NextResponse.json({ error: eventiError.message }, { status: 400 });
  }

  const risultati = await Promise.all(
    eventi.map(async (evento) => {
      const { count, error } = await supabase
        .from("lista")
        .select("*", { count: "exact", head: true })
        .eq("evento_id", evento.id)
        .eq("pr_id", pr_id);

      if (error) {
        console.error(`❌ Errore conteggio evento ${evento.id}:`, error.message);
      }

      return {
        id: evento.id,
        nomeEvento: evento.nome,
        data: evento.data,
        numeroNomi: count || 0,
      };
    })
  );

  return NextResponse.json(risultati, { status: 200 });
}
