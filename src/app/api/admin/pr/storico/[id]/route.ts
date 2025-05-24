import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface PR {
  id: string;
  nome: string;
  cognome: string;
}

interface Evento {
  evento: { id: number; nome: string };
  evento_id: number;
  ingresso: boolean;
  nome_utente: string;
  cognome_utente: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const urlParts = req.nextUrl.pathname.split("/");
  const prId = urlParts[urlParts.length - 1];

  if (!prId) {
    return NextResponse.json({ error: "ID PR non fornito" }, { status: 400 });
  }

  const { data: pr, error: prError } = await supabase
    .from("pr")
    .select("id, nome, cognome")
    .eq("id", prId)
    .single<PR>();

  if (prError || !pr) {
    return NextResponse.json({ error: "PR non trovato" }, { status: 404 });
  }

  const { data: eventi, error: eventiError } = await supabase
    .from("lista")
    .select("evento_id, ingresso, nome_utente, cognome_utente, evento:evento_id (id, nome)")
    .eq("pr_id", prId)
    .order("evento_id", { ascending: false }) as unknown as { data: Evento[]; error: { message: string } };

  if (eventiError) {
    return NextResponse.json({ error: eventiError.message }, { status: 400 });
  }

  if (!eventi || !Array.isArray(eventi) || eventi.length === 0) {
    return NextResponse.json({ error: "Nessun evento trovato" }, { status: 404 });
  }

  const eventoMap = new Map<number, {
    evento_nome: string;
    ospiti_totali: number;
    ospiti_entrati: number;
    nomi_utenti: { nome: string; cognome: string; ingresso: boolean }[];
  }>();

  eventi.forEach((evento) => {
    const eventoNome = evento.evento ? evento.evento.nome : "Evento sconosciuto";

    if (!eventoMap.has(evento.evento_id)) {
      eventoMap.set(evento.evento_id, {
        evento_nome: eventoNome,
        ospiti_totali: 0,
        ospiti_entrati: 0,
        nomi_utenti: [],
      });
    }

    const eventoData = eventoMap.get(evento.evento_id)!;
    eventoData.ospiti_totali += 1;
    if (evento.ingresso) {
      eventoData.ospiti_entrati += 1;
    }
    eventoData.nomi_utenti.push({
      nome: evento.nome_utente,
      cognome: evento.cognome_utente,
      ingresso: evento.ingresso,
    });
  });

  return NextResponse.json({
    nome: pr.nome,
    cognome: pr.cognome,
    storico_eventi: Array.from(eventoMap.values()),
  });
}
