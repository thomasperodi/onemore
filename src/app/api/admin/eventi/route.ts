import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 📦 Utility: formattazione indirizzo
function formatIndirizzo(indirizzo: string): string {
  const trimmed = indirizzo.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * 📥 Recupera tutti gli eventi ordinati per data con statistiche
 */
export async function GET() {
  console.log("▶️ GET /api/admin/eventi");

  const { data: eventi, error: eventiError } = await supabase
    .from("eventi")
    .select("*")
    .order("data", { ascending: false });

  if (eventiError) {
    console.error("❌ Errore recupero eventi:", eventiError.message);
    return NextResponse.json({ error: eventiError.message }, { status: 400 });
  }

  const eventiArricchiti = await Promise.all(
    eventi.map(async (evento) => {
      const eventoId = evento.id;

      // Persone in lista
      const { data: listaCount, error: listaError } = await supabase
        .from("lista")
        .select("id", { count: "exact" })
        .eq("evento_id", eventoId);

      const personeInLista = listaCount ? listaCount.length : 0;

      if (listaError) {
        console.error(`❌ Errore lista evento ${eventoId}:`, listaError.message);
      }

      // Ingressi effettivi
      const { data: ingressiCount, error: ingressiError } = await supabase
        .from("lista")
        .select("id", { count: "exact" })
        .eq("evento_id", eventoId)
        .eq("ingresso", true);

      const ingressiEffettivi = ingressiCount ? ingressiCount.length : 0;

      if (ingressiError) {
        console.error(`❌ Errore ingressi evento ${eventoId}:`, ingressiError.message);
      }

      // Incasso
      const { data: incassoData, error: incassoError } = await supabase
        .from("lista")
        .select("incasso");

      const incassoTotale = incassoData
        ? incassoData.reduce((acc, e) => acc + (e.incasso || 0), 0)
        : 0;

      if (incassoError) {
        console.error(`❌ Errore incasso evento ${eventoId}:`, incassoError.message);
      }

      return {
        ...evento,
        persone_in_lista: personeInLista,
        ingressi_effettivi: ingressiEffettivi,
        incasso_totale: incassoTotale,
      };
    })
  );

  console.log("✅ Eventi recuperati con successo:", eventiArricchiti.length);
  return NextResponse.json(eventiArricchiti, { status: 200 });
}

/**
 * ➕ Crea un nuovo evento
 */
export async function POST(req: Request) {
  try {
    console.log("▶️ POST /api/admin/eventi");

    const body = await req.json();
    console.log("📦 Dati ricevuti:", body);

    const { nome, data, locandina, attivo, indirizzo } = body;

    if (!nome || !data || !locandina || !indirizzo) {
      console.warn("⚠️ Campi mancanti:", { nome, data, locandina, indirizzo });
      return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });
    }

    const indirizzoFormattato = formatIndirizzo(indirizzo);

    const { error } = await supabase
      .from("eventi")
      .insert([{ nome, data, locandina, indirizzo: indirizzoFormattato, attivo: attivo ?? true }]);

    if (error) {
      console.error("❌ Errore inserimento evento:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ Evento creato con successo");
    return NextResponse.json({ message: "Evento creato con successo" }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error) {
    console.error("🔥 Errore generale POST:", e.message);
    return NextResponse.json({ error: "Errore interno nel server" }, { status: 500 });
    }
  }
}

/**
 * ✏️ Modifica un evento esistente
 */
export async function PUT(req: Request) {
  try {
    console.log("▶️ PUT /api/admin/eventi");

    const body = await req.json();
    console.log("📦 Dati aggiornamento:", body);

    const { id, nome, data, locandina, attivo, indirizzo } = body;

    if (!id || !nome || !data || !locandina || !indirizzo) {
      console.warn("⚠️ Campi mancanti per update:", { id, nome, data, locandina, indirizzo });
      return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });
    }

    const indirizzoFormattato = formatIndirizzo(indirizzo);

    const { error } = await supabase
      .from("eventi")
      .update({ nome, data, locandina, attivo, indirizzo: indirizzoFormattato })
      .eq("id", id);

    if (error) {
      console.error("❌ Errore aggiornamento evento:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ Evento aggiornato con successo");
    return NextResponse.json({ message: "Evento aggiornato con successo" }, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("🔥 Errore generale PUT:", e.message);
    } else {
      console.error("🔥 Errore generale PUT:", e);
    }
    return NextResponse.json({ error: "Errore interno nel server" }, { status: 500 });
  }
}

/**
 * ❌ Elimina un evento
 */
export async function DELETE(req: Request) {
  try {
    console.log("▶️ DELETE /api/admin/eventi");

    const body = await req.json();
    console.log("📦 Richiesta eliminazione:", body);

    const { id } = body;

    if (!id) {
      console.warn("⚠️ ID mancante per eliminazione");
      return NextResponse.json({ error: "ID obbligatorio" }, { status: 400 });
    }

    const { error } = await supabase.from("eventi").delete().eq("id", id);

    if (error) {
      console.error("❌ Errore eliminazione evento:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ Evento eliminato con successo");
    return NextResponse.json({ message: "Evento eliminato con successo" }, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("🔥 Errore generale DELETE:", e.message);
    } else {
      console.error("🔥 Errore generale DELETE:", e);
    }
    return NextResponse.json({ error: "Errore interno nel server" }, { status: 500 });
  }
}
