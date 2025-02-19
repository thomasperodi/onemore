import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // ✅ Estrai l'ID dall'URL
  const urlParts = req.nextUrl.pathname.split("/");
  const eventoId = parseInt(urlParts[urlParts.length - 1], 10);

  if (isNaN(eventoId)) {
    return NextResponse.json({ error: "ID evento non valido" }, { status: 400 });
  }

  // 🔍 Recupera i dettagli dell'evento
  const { data: evento, error: eventoError } = await supabase
    .from("eventi")
    .select("id, nome, locandina, data")
    .eq("id", eventoId)
    .single();

  if (eventoError || !evento) {
    return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
  }

  // 🔍 Recupera gli incassi e il numero di ingressi per fascia di prezzo
  const { data: incassiData, error: incassiError } = await supabase
    .from("incassi_per_fascia")
    .select("prezzo, numero_ingressi, totale_incasso")
    .eq("evento_id", eventoId);

  if (incassiError) {
    return NextResponse.json({ error: "Errore nel recupero degli incassi" }, { status: 500 });
  }

  // 🏆 Strutture per gli incassi e gli ingressi divisi per fascia di prezzo
  const incassiPerPrezzo: { [key: number]: number } = { 10: 0, 12: 0, 15: 0 };
  const ingressiPerPrezzo: { [key: number]: number } = { 10: 0, 12: 0, 15: 0 };

  if (incassiData) {
    incassiData.forEach((entry: { prezzo: number; totale_incasso: number; numero_ingressi: number }) => {
      const prezzo: number = entry.prezzo;
      const totaleIncasso = entry.totale_incasso || 0;
      const numeroIngressi = entry.numero_ingressi || 0;

      if ([10, 12, 15].includes(prezzo)) {
        incassiPerPrezzo[prezzo] = totaleIncasso;
        ingressiPerPrezzo[prezzo] = numeroIngressi;
      }
    });
  }

  return NextResponse.json({
    evento: {
      id: evento.id,
      nome: evento.nome,
      locandina: evento.locandina,
      data: evento.data,
    },
    incassi_per_prezzo: incassiPerPrezzo, // ✅ Totale incassi per fascia di prezzo
    ingressi_per_prezzo: ingressiPerPrezzo, // ✅ Numero di ingressi per fascia di prezzo
  }, { status: 200 });
}
