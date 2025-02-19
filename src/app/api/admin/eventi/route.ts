import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Recupera tutti gli eventi ordinati per data
 */
export async function GET() {
  // 🔍 Recupera tutti gli eventi ordinati per data
  const { data: eventi, error: eventiError } = await supabase
    .from("eventi")
    .select("*")
    .order("data", { ascending: false });

  if (eventiError) {
    return NextResponse.json({ error: eventiError.message }, { status: 400 });
  }

  // 🔄 Itera su ogni evento per aggiungere le statistiche
  const eventiArricchiti = await Promise.all(
    eventi.map(async (evento) => {
      const eventoId = evento.id;

      // 🔍 Conta il numero di persone in lista per l'evento
      const { data: listaCount, error: listaError } = await supabase
        .from("lista")
        .select("id", { count: "exact" })
        .eq("evento_id", eventoId);

      const personeInLista = listaCount ? listaCount.length : 0;

      if (listaError) {
        console.error(`Errore nel recupero della lista per evento ${eventoId}:`, listaError.message);
      }

      // 🔍 Conta il numero di ingressi effettivi
      const { data: ingressiCount, error: ingressiError } = await supabase
        .from("lista")
        .select("id", { count: "exact" })
        .eq("evento_id", eventoId)
        .eq("ingresso", true);

      const ingressiEffettivi = ingressiCount ? ingressiCount.length : 0;

      if (ingressiError) {
        console.error(`Errore nel recupero degli ingressi per evento ${eventoId}:`, ingressiError.message);
      }

      // 🔍 Calcola l'incasso totale per l'evento
      const { data: incassoData, error: incassoError } = await supabase
        .from("lista")
        .select("incasso");

      const incassoTotale = incassoData
        ? incassoData.reduce((acc, e) => acc + (e.incasso || 0), 0)
        : 0;

      if (incassoError) {
        console.error(`Errore nel recupero dell'incasso per evento ${eventoId}:`, incassoError.message);
      }

      return {
        ...evento,
        persone_in_lista: personeInLista,
        ingressi_effettivi: ingressiEffettivi,
        incasso_totale: incassoTotale,
      };
    })
  );

  return NextResponse.json(eventiArricchiti, { status: 200 });
}
/**
 * Crea un nuovo evento
 */
export async function POST(req: Request) {
  const { nome, data, locandina, attivo } = await req.json();

  if (!nome || !data || !locandina ) {
    return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });
  }

  const { error } = await supabase
    .from("eventi")
    .insert([{ nome, data, locandina, attivo: attivo ?? true }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Evento creato con successo" }, { status: 201 });
}

/**
 * Modifica un evento esistente
 */
export async function PUT(req: Request) {
  const { id, nome, data, locandina, attivo } = await req.json();

  if (!id || !nome || !data || !locandina  ) {
    return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });
  }

  const { error } = await supabase
    .from("eventi")
    .update({ nome, data, locandina, attivo })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Evento aggiornato con successo" }, { status: 200 });
}

/**
 * Elimina un evento
 */
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID obbligatorio" }, { status: 400 });
  }

  const { error } = await supabase.from("eventi").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Evento eliminato con successo" }, { status: 200 });
}