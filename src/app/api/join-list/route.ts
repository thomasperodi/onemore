import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let nome = body.nome;
    let cognome = body.cognome;
    const eventoId = body.eventoId;
    const prId = body.prId;

    if (!nome || !cognome || !eventoId) {
      return NextResponse.json({ error: "Nome, cognome ed eventoId sono obbligatori" }, { status: 400 });
    }

    // 🛠️ Format nome e cognome
    const formatString = (str: string) => str.trim().toLowerCase().replace(/^(\w)/, (c: string) => c.toUpperCase());
    nome = formatString(nome);
    cognome = formatString(cognome);

    // 🔍 Controlla se l'utente è già in lista
    const { data: existingUsers, error: checkError } = await supabase
      .from("lista")
      .select("id")
      .eq("nome_utente", nome)
      .eq("cognome_utente", cognome)
      .eq("evento_id", eventoId);

    if (checkError) {
      console.error("Errore durante il controllo duplicati:", checkError);
      return NextResponse.json({ error: "Errore durante il controllo duplicati" }, { status: 500 });
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: "Utente già inserito in lista" }, { status: 409 });
    }

    // 🕒 Determina il prezzo in base all'orario
    const determinaPrezzo = (): number => {
      const oraCorrente = new Date().getHours();
      if (oraCorrente >= 18 && oraCorrente < 20) return 10;
      if (oraCorrente >= 20 && oraCorrente < 22) return 12;
      return 15;
    };

    const prezzoIngresso = determinaPrezzo();

    // ⏳ Inserimento in lista con incasso calcolato
    const { error } = await supabase.from("lista").insert([
      { 
        evento_id: eventoId, 
        pr_id: prId || null, 
        nome_utente: nome, 
        cognome_utente: cognome, 
        ingresso: false, 
        incasso: prezzoIngresso 
      }
    ]);

    if (error) {
      console.error("Errore Supabase:", error);
      return NextResponse.json({ error: "Errore durante l'inserimento in lista" }, { status: 500 });
    }

    return NextResponse.json({ message: "Registrazione completata con successo!", incasso: prezzoIngresso }, { status: 200 });
  } catch (error) {
    console.error("Errore API:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
