import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pr_id = searchParams.get("pr_id");
    const evento_id = searchParams.get("evento_id");

    if (!pr_id || !evento_id) {
      return NextResponse.json({ error: "PR ID ed Evento ID sono obbligatori" }, { status: 400 });
    }

    const { data: lista, error: listaError } = await supabase
      .from("lista")
      .select("id, nome_utente, cognome_utente, ingresso, orario_ingresso")
      .eq("evento_id", evento_id)
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
