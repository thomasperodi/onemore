import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const urlParts = req.nextUrl.pathname.split("/");
  const eventoId = parseInt(urlParts[urlParts.length - 1], 10);

  if (isNaN(eventoId)) {
    return NextResponse.json({ error: "ID evento non valido" }, { status: 400 });
  }

  // Recupera evento con modalità
  const { data: evento, error: eventoError } = await supabase
    .from("eventi")
    .select("id, nome, locandina, data, modalita_calcolo")
    .eq("id", eventoId)
    .single();

  if (eventoError || !evento) {
    return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
  }

  const modalita = evento.modalita_calcolo.toLowerCase();

  // Recupera ingressi in lista (tabella "lista")
  const { data: listaData, error: listaError } = await supabase
    .from("lista")
    .select("orario_ingresso, incasso")
    .eq("evento_id", eventoId)
    .eq("ingresso", true);

  if (listaError) {
    return NextResponse.json({ error: "Errore nel recupero lista" }, { status: 500 });
  }

  // Recupera ingressi fuori lista
  const { data: fuoriListaData, error: fuoriListaError } = await supabase
    .from("fuori_lista")
    .select("orario_ingresso, incasso")
    .eq("evento_id", eventoId);

  if (fuoriListaError) {
    return NextResponse.json({ error: "Errore nel recupero fuori lista" }, { status: 500 });
  }

  let statistiche: {
    in_lista_pre_21?: number;
    in_lista_post_21?: number;
    fuori_lista: number;
    incasso_totale: number;
    in_lista?: number;
  } = {
    fuori_lista: 0,
    incasso_totale: 0
  };
  let incassoTotale = 0;

  if (modalita === "cala_more") {
    let inListaPre21 = 0;
    let inListaPost21 = 0;

    listaData?.forEach((entry) => {
      const ora = new Date(entry.orario_ingresso).getHours();
      if (ora < 21) inListaPre21++;
      else inListaPost21++;
      incassoTotale += entry.incasso ?? 0;
    });

    fuoriListaData?.forEach((entry) => {
      incassoTotale += entry.incasso ?? 0;
    });

    statistiche = {
      in_lista_pre_21: inListaPre21,
      in_lista_post_21: inListaPost21,
      fuori_lista: fuoriListaData?.length ?? 0,
      incasso_totale: incassoTotale,
    };
  } else {
    statistiche = {
      in_lista: listaData?.length ?? 0,
      fuori_lista: fuoriListaData?.length ?? 0,
      incasso_totale:
        (listaData?.reduce((acc, cur) => acc + (cur.incasso ?? 0), 0) ?? 0) +
        (fuoriListaData?.reduce((acc, cur) => acc + (cur.incasso ?? 0), 0) ?? 0),
    };
  }

  return NextResponse.json(
    {
      evento: {
        id: evento.id,
        nome: evento.nome,
        locandina: evento.locandina,
        data: evento.data,
        modalita_calcolo: evento.modalita_calcolo,
      },
      statistiche,
    },
    { status: 200 }
  );
}
