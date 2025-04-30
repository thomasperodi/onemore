import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pr_id = searchParams.get("pr_id");
    const evento_id = searchParams.get("evento_id");

    if (!pr_id || !evento_id) {
      return NextResponse.json({ error: "PR ID ed Evento ID sono richiesti" }, { status: 400 });
    }

    const { count, error } = await supabase
      .from("lista")
      .select("*", { count: "exact", head: true })
      .eq("evento_id", evento_id)
      .eq("pr_id", pr_id);

    if (error) {
      console.error("Errore conteggio lista:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (err) {
    console.error("Errore generico:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
