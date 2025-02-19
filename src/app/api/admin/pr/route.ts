import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔹 Ottieni la lista dei PR attuali
export async function GET() {
  const { data, error } = await supabase
    .from("pr")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

// 🔹 Aggiungi un nuovo PR
export async function POST(req: Request) {
  const { nome, cognome } = await req.json();

  const { data, error } = await supabase
    .from("pr")
    .insert([{ nome, cognome }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
// Modifica un PR esistente

export async function PUT(req: Request) {
  const { id, nome, cognome } = await req.json();

  if (!id || !nome || !cognome) {
    return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
  }

  const { error } = await supabase
    .from("pr")
    .update({ nome, cognome })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "PR aggiornato con successo" }, { status: 200 });
}

// 🔹 Rimuovi un PR
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const { error } = await supabase.from("pr").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
