import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pr_id = searchParams.get("pr_id");

    if (!pr_id) {
      return NextResponse.json({ error: "PR ID is required" }, { status: 400 });
    }

    console.log("PR ID ricevuto:", pr_id);

    // Recupera l'evento attivo
    const { data: eventoAttivo, error: eventoError } = await supabase
      .from("eventi")
      .select("id")
      .eq("attivo", true)
      .maybeSingle();

    if (eventoError) {
      console.error("Errore nel recupero dell'evento attivo:", eventoError);
      return NextResponse.json({ error: eventoError.message }, { status: 500 });
    }

    if (!eventoAttivo) {
      return NextResponse.json({ error: "Nessun evento attivo trovato" }, { status: 404 });
    }

    console.log("Evento attivo trovato:", eventoAttivo);

    // Conta le persone in lista per l'evento attivo e per il PR specifico
    const { count, error: listaError } = await supabase
      .from("lista")
      .select("*", { count: "exact", head: true })
      .eq("evento_id", eventoAttivo.id)
      .eq("pr_id", pr_id);

    if (listaError) {
      console.error("Errore nel conteggio delle persone in lista:", listaError);
      return NextResponse.json({ error: listaError.message }, { status: 500 });
    }

    console.log("Numero di persone trovate:", count);

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Errore generico:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
