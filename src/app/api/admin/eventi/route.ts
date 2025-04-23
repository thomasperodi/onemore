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
export async function GET(req: Request) {
  console.log("▶️ GET /api/admin/eventi");

  // Legge i parametri di query dalla URL
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Recupera gli eventi con range paginato
  const { data: eventi, error: eventiError, count } = await supabase
    .from("eventi")
    .select("*", { count: "exact" })
    .order("data", { ascending: false })
    .range(from, to);

  if (eventiError) {
    console.error("❌ Errore recupero eventi:", eventiError.message);
    return NextResponse.json({ error: eventiError.message }, { status: 400 });
  }

  // Arricchisci ogni evento con i dati statistici
  const eventiArricchiti = await Promise.all(
    eventi.map(async (evento) => {
      const eventoId = evento.id;

      // Conteggio persone in lista
      const { count: listaCount, error: listaError } = await supabase
        .from("lista")
        .select("*", { count: "exact", head: true })
        .eq("evento_id", eventoId);

      // Conteggio ingressi effettivi
      const { count: ingressiCount, error: ingressiError } = await supabase
        .from("lista")
        .select("*", { count: "exact", head: true })
        .eq("evento_id", eventoId)
        .eq("ingresso", true);

      // Calcolo incasso totale
      const { data: incassoData, error: incassoError } = await supabase
        .from("lista")
        .select("incasso")
        .eq("evento_id", eventoId);

      const incassoTotale = incassoData?.reduce((acc, e) => acc + (e.incasso || 0), 0) || 0;

      if (listaError) console.error(`⚠️ Errore lista evento ${eventoId}:`, listaError.message);
      if (ingressiError) console.error(`⚠️ Errore ingressi evento ${eventoId}:`, ingressiError.message);
      if (incassoError) console.error(`⚠️ Errore incasso evento ${eventoId}:`, incassoError.message);

      return {
        ...evento,
        persone_in_lista: listaCount || 0,
        ingressi_effettivi: ingressiCount || 0,
        incasso_totale: incassoTotale,
      };
    })
  );

  const totalePagine = Math.ceil((count || 0) / limit);

  console.log(`✅ Eventi recuperati (pagina ${page}/${totalePagine}):`, eventiArricchiti.length);
  return NextResponse.json({ eventi: eventiArricchiti, totalePagine }, { status: 200 });
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
