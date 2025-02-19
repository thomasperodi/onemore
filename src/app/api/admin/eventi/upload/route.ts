import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import path from "path";
import os from "os";
import mime from "mime"; // 📌 Ottiene il tipo MIME corretto

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nessun file inviato" }, { status: 400 });
    }

    // 📌 Creiamo un file temporaneo in una cartella sicura
    const tempFilePath = path.join(os.tmpdir(), `${randomUUID()}-${file.name}`);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 📌 Scriviamo il file localmente
    writeFileSync(tempFilePath, fileBuffer);

    // 📌 Leggiamo il file binario
    const finalBuffer = readFileSync(tempFilePath);
    const fileExt = path.extname(file.name);
    const mimeType = mime.getType(fileExt) || "application/octet-stream"; // 📌 Tipo MIME corretto

    // 📌 Nome finale del file per Supabase
    const fileName = `${Date.now()}-${randomUUID()}${fileExt}`;

    // 📌 Carichiamo su Supabase Storage
    const { data, error } = await supabase.storage
      .from("event-locandine")
      .upload(fileName, finalBuffer, {
        contentType: mimeType,
      });

    // 📌 Eliminiamo il file temporaneo
    unlinkSync(tempFilePath);

    if (error) {
      return NextResponse.json({ error: "Errore nell'upload", details: error.message }, { status: 500 });
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-locandine/${data.path}`;
    return NextResponse.json({ fileUrl }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Errore durante l'upload", details: errorMessage }, { status: 500 });
  }
}
