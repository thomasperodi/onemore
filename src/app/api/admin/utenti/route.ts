import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔹 Ottieni la lista degli Utenti attuali
export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const { id, username, password } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID utente mancante" }, { status: 400 });
  }

  const updateFields: { [key: string]: string } = {};

  if (username) {
    updateFields.username = username;
  }

  if (password) {
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.password = hashedPassword;
    } catch  {
      return NextResponse.json({ error: "Errore nell'hashing della password" }, { status: 500 });
    }
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: "Nessun campo da aggiornare" }, { status: 400 });
  }

  const { error } = await supabase
    .from("users")
    .update(updateFields)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Dati aggiornati con successo" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID utente mancante" }, { status: 400 });
    }
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Utente eliminato con successo" }, { status: 200 });
    }
    