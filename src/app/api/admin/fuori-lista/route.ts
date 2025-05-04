import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { evento_id } = await req.json();

    if (!evento_id) {
      return NextResponse.json({ error: "ID evento mancante" }, { status: 400 });
    }

    // Recupera la modalità di calcolo dell'evento
    const { data: evento, error: eventoErr } = await supabase
      .from("eventi")
      .select("modalita_calcolo")
      .eq("id", evento_id)
      .single();

    if (eventoErr || !evento) {
      return NextResponse.json({ error: "Evento non trovato" }, { status: 400 });
    }

    const ora = new Date();
    const oraItaliana = new Date(ora.toLocaleString("sv-SE", { timeZone: "Europe/Rome" }));
    const ore = oraItaliana.getHours();

    let incasso = 0;

    // Calcolo prezzo fuori lista in base alla modalità e orario
    switch (evento.modalita_calcolo) {
      case "Paradise":
        incasso = 20;
        break;
      case "Cala More":
        incasso = ore < 21 ? 12 : 15;
        break;
      default:
        incasso = 0;
    }

    const timestamp = oraItaliana.toISOString(); // formato ISO coerente con `timestamp without time zone`

    // Inserisci il fuori lista
    const { data, error } = await supabase
      .from("fuori_lista")
      .insert([{ evento_id, orario_ingresso: timestamp, incasso }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error("Errore fuori lista:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
