import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pr_id = searchParams.get("pr_id");

    if (!pr_id) {
      return NextResponse.json({ error: "PR ID is required" }, { status: 400 });
    }

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

    // Recupera i nomi nella lista per il PR e l'evento attivo
    const { data: lista, error: listaError } = await supabase
      .from("lista")
      .select("id, nome_utente, cognome_utente, ingresso, orario_ingresso")
      .eq("evento_id", eventoAttivo.id)
      .eq("pr_id", pr_id);

    if (listaError) {
      console.error("Errore nel recupero della lista:", listaError);
      return NextResponse.json({ error: listaError.message }, { status: 500 });
    }

    return NextResponse.json(lista);
  } catch (error) {
    console.error("Errore generico:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}