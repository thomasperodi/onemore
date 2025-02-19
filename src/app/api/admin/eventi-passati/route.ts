import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Recupera gli eventi passati con il numero di ospiti
export async function GET() {
  const { data: eventi, error } = await supabase
    .from("eventi")
    .select("id, nome, data")
    .lt("data", new Date().toISOString()) // Eventi con data passata
    .order("data", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const eventiConOspiti = await Promise.all(
    eventi.map(async (evento) => {
      const { data: ospiti, error: ospitiError } = await supabase
        .from("lista")
        .select("id")
        .eq("evento_id", evento.id);

      return {
        id: evento.id,
        nome: evento.nome,
        data: evento.data,
        ospiti: ospitiError ? 0 : ospiti.length,
      };
    })
  );

  return NextResponse.json(eventiConOspiti, { status: 200 });
}
