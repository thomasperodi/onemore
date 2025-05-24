import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Recupera tutta la lista con il join su PR
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventoId = searchParams.get("evento_id");
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "1000");

  if (!eventoId) {
    return NextResponse.json({ error: "evento_id è obbligatorio" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("lista")
    .select(`
      id,
      evento_id,
      nome_utente,
      cognome_utente,
      ingresso,
      orario_ingresso,
      incasso,
      pr_id,
      pr:pr_id (
        nome,
        cognome
      )
    `)
    .eq("evento_id", eventoId)
    .order("id", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}


// ✅ Regole incasso in base all'orario
// const pricingRules = [
//   { oraLimite: "20:00", prezzo: 10 },
//   { oraLimite: "21:00", prezzo: 12 },
//   { oraLimite: "23:59", prezzo: 15 },
// ];

// function calcolaPrezzo(orario: string): number {
//   try {
//     // Supporta sia "2025-04-17T20:00:00" che "2025-04-17 20:00:00"
//     const parts = orario.includes("T") ? orario.split("T") : orario.split(" ");
//     const timePart = parts[1]?.slice(0, 5); // "HH:MM"

//     if (!timePart) return pricingRules.at(-1)?.prezzo ?? 15;

//     const [oraIngresso, minutoIngresso] = timePart.split(":").map(Number);
//     const minutiIngresso = oraIngresso * 60 + minutoIngresso;

//     for (const regola of pricingRules) {
//       const [h, m] = regola.oraLimite.split(":").map(Number);
//       const minutiLimite = h * 60 + m;
//       if (minutiIngresso <= minutiLimite) return regola.prezzo;
//     }

//     return pricingRules.at(-1)?.prezzo ?? 15;
//   } catch (error) {
//     console.error("Errore calcolo prezzo:", error);
//     return pricingRules.at(-1)?.prezzo ?? 15;
//   }
// }


// ✅ PATCH: aggiorna ingresso, orario e incasso
export async function PATCH(req: Request) {
  try {
    const { id, ingresso } = await req.json();

    if (!id || typeof ingresso !== "boolean") {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    let timestamp: string | null = null;
    let incasso: number = 0;

    if (ingresso) {
      timestamp = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Rome" });

      // Recupera evento collegato
      const { data: listaRow, error: listaErr } = await supabase
        .from("lista")
        .select("evento_id")
        .eq("id", id)
        .single();

      if (listaErr || !listaRow?.evento_id) {
        return NextResponse.json({ error: "Evento non trovato" }, { status: 400 });
      }

      const { data: evento, error: eventoErr } = await supabase
        .from("eventi")
        .select("modalita_calcolo")
        .eq("id", listaRow.evento_id)
        .single();

      if (eventoErr || !evento?.modalita_calcolo) {
        return NextResponse.json({ error: "Errore nel recupero evento" }, { status: 400 });
      }

      const ora = new Date(timestamp).getHours();
      const modalita = evento.modalita_calcolo;

      // Calcolo prezzo per chi è in lista
      switch (modalita) {
        case "Paradise":
          incasso = 15;
          break;

        case "Cala More":
          incasso = ora < 21 ? 10 : 12;
          break;

        default:
          incasso = 0;
      }
    }

    const { data, error } = await supabase
      .from("lista")
      .update({ ingresso, orario_ingresso: timestamp, incasso })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Errore PATCH:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
