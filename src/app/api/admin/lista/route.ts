import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Recupera tutta la lista con il join su PR
export async function GET() {
  const { data, error } = await supabase
    .from("lista")
    .select("id, evento_id, nome_utente, cognome_utente, ingresso, orario_ingresso, incasso, pr_id, pr:pr_id(nome, cognome)")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}



// Configurazione soglie e prezzi (facile da modificare)
const pricingRules = [
  { oraLimite: "20:00", prezzo: 10 },
  { oraLimite: "21:00", prezzo: 12 },
  { oraLimite: "23:59", prezzo: 15 },
];

function calcolaPrezzo(orario: string): number {
  const [oraIngresso, minutoIngresso] = orario.split("T")[1].split(":").map(Number);
  const minutiIngresso = oraIngresso * 60 + minutoIngresso;

  for (const regola of pricingRules) {
    const [h, m] = regola.oraLimite.split(":").map(Number);
    const minutiLimite = h * 60 + m;
    if (minutiIngresso <= minutiLimite) {
      return regola.prezzo;
    }
  }

  return pricingRules[pricingRules.length - 1].prezzo; // fallback
}

export async function PATCH(req: Request) {
  const { id, ingresso } = await req.json();

  // Se ingresso è TRUE, salva l'orario e calcola l'incasso
  let timestamp: string | null = null;
  let incasso: number | null = null;

  if (ingresso) {
    timestamp = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Rome" });
    incasso = calcolaPrezzo(timestamp);
  }

  const { data, error } = await supabase
    .from("lista")
    .update({ ingresso, orario_ingresso: timestamp, incasso })
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
