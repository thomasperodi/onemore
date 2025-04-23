import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { nome, cognome} = body;
    const { eventoId, prId} = body;

    if (!nome || !cognome || !eventoId || !prId) {
      return NextResponse.json(
        { error: "Nome, cognome, eventoId e prId sono obbligatori" },
        { status: 400 }
      );
    }

    // 🛠️ Format nome e cognome
    const formatString = (str: string) =>
      str.trim().toLowerCase().replace(/^(\w)/, (c: string) => c.toUpperCase());
    nome = formatString(nome);
    cognome = formatString(cognome);

    // 🔍 Controlla se l'utente è già in lista per lo stesso evento
    const { data: existingUsers, error: checkError } = await supabase
      .from("lista")
      .select("id")
      .eq("nome_utente", nome)
      .eq("cognome_utente", cognome)
      .eq("evento_id", eventoId);

    if (checkError) {
      console.error("Errore durante il controllo duplicati:", checkError);
      return NextResponse.json(
        { error: "Errore durante il controllo duplicati" },
        { status: 500 }
      );
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Utente già inserito in lista" },
        { status: 409 }
      );
    }

    // ✅ Inserisci nuovo utente in lista
    const { error: insertError } = await supabase.from("lista").insert([
      {
        nome_utente: nome,
        cognome_utente: cognome,
        evento_id: eventoId,
        pr_id: prId,
      },
    ]);

    if (insertError) {
      console.error("Errore durante l'inserimento:", insertError);
      return NextResponse.json(
        { error: "Errore durante l'inserimento in lista" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registrazione completata con successo!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore API:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
