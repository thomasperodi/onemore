import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Definizione delle interfacce per Supabase
interface PR {
  id: string;
  nome: string;
  cognome: string;
}

// interface Evento {
//   evento_id: number;
//   ingresso: boolean;
//   eventi?: { id: number; nome: string }[]; // ✅ Può essere un array
// }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // ✅ Estrai il PR ID dall'URL
  const urlParts = req.nextUrl.pathname.split("/");
  const prId = urlParts[urlParts.length - 1];

  if (!prId) {
    return NextResponse.json({ error: "ID PR non fornito" }, { status: 400 });
  }

  // 🔍 Recupera i dettagli del PR
  const { data: pr, error: prError } = await supabase
    .from("pr")
    .select("id, nome, cognome")
    .eq("id", prId)
    .single<PR>();

  if (prError || !pr) {
    return NextResponse.json({ error: "PR non trovato" }, { status: 404 });
  }

  // 🔍 Recupera lo storico degli eventi con JOIN sulla tabella eventi
  const { data: eventi, error: eventiError } = await supabase
    .from("lista")
    .select("evento_id, ingresso, eventi(id, nome)")
    .eq("pr_id", prId)
    .order("evento_id", { ascending: false });

  // ✅ Controllo errori
  if (eventiError) {
    return NextResponse.json({ error: eventiError.message }, { status: 400 });
  }

  if (!eventi || !Array.isArray(eventi)) {
    return NextResponse.json({ error: "Nessun evento trovato" }, { status: 404 });
  }

  // 🔄 Raggruppa gli ospiti per evento
  const eventoMap = new Map();
  eventi.forEach((evento) => {
    const eventoNome = Array.isArray(evento.eventi) && evento.eventi.length > 0 
      ? evento.eventi[0]?.nome 
      : "Evento sconosciuto";

    if (!eventoMap.has(evento.evento_id)) {
      eventoMap.set(evento.evento_id, {
        evento_nome: eventoNome,
        ospiti_totali: 0,
        ospiti_entrati: 0,
      });
    }
    eventoMap.get(evento.evento_id).ospiti_totali += 1;
    if (evento.ingresso) {
      eventoMap.get(evento.evento_id).ospiti_entrati += 1;
    }
  });

  return NextResponse.json({
    nome: pr.nome,
    cognome: pr.cognome,
    storico_eventi: Array.from(eventoMap.values()),
  });
}
