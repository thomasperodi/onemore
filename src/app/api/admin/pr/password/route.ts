import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request) {
  const { prId, nuovaPassword } = await req.json();

  if (!prId || !nuovaPassword?.trim()) {
    return NextResponse.json(
      { error: "ID del PR e nuova password sono obbligatori" },
      { status: 400 }
    );
  }

  try {
    // 🔹 Recupera il record PR e il relativo user_id
    const { data: prRecord, error: prError } = await supabase
      .from("pr")
      .select("user_id")
      .eq("id", prId)
      .single();

    if (prError || !prRecord?.user_id) {
      return NextResponse.json(
        { error: "PR non trovato o non associato ad un utente" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(nuovaPassword, 10);

    // 🔹 Aggiorna la password nella tabella users
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", prRecord.user_id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
