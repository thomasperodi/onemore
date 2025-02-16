import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Recuperare la lista degli ospiti per un PR specifico
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pr_id = searchParams.get("pr_id");

  if (!pr_id) return NextResponse.json({ error: "PR ID richiesto" }, { status: 400 });

  const { data: lista, error } = await supabase
    .from("lista")
    .select("*")
    .eq("pr_id", pr_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(lista, { status: 200 });
}
