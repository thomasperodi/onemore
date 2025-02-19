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

// Aggiorna lo stato di ingresso di un ospite
export async function PATCH(req: Request) {
    const { id, ingresso } = await req.json();
  
    // Se ingresso è TRUE, salva l'orario, altrimenti rimuovilo (null)
    const timestamp = ingresso ? new Date().toLocaleString("sv-SE", { timeZone: "Europe/Rome" }) : null;
  
    const { data, error } = await supabase
      .from("lista")
      .update({ ingresso, orario_ingresso: timestamp })
      .eq("id", id)
      .select();
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  
    return NextResponse.json(data, { status: 200 });
  }