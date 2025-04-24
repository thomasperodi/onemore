import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Funzione per pulire e capitalizzare
const formatName = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

export async function POST(request: Request) {
  try {
    const { nome, cognome, username, email, password } = await request.json();

    // Pulisce nome e cognome
    const cleanedNome = formatName(nome);
    const cleanedCognome = formatName(cognome);

    // Controlla se il PR esiste nella tabella PR
    const { data: prData, error: prError } = await supabase
      .from('pr')
      .select('*')
      .eq('nome', cleanedNome)
      .eq('cognome', cleanedCognome)
      .single();

    if (prError || !prData) {
      return NextResponse.json({ error: 'Nome e cognome non trovati nella lista PR.' }, { status: 400 });
    }

    // Verifica duplicati username/email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Username o email già in uso.' }, { status: 400 });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserimento nuovo utente
    const { data: insertedUsers, error: userError } = await supabase
      .from('users')
      .insert([
        {
          nome: cleanedNome,
          cognome: cleanedCognome,
          username,
          email,
          password: hashedPassword,
          ruolo: 'pr',
        },
      ])
      .select('id')
      .single();

    if (userError || !insertedUsers) {
      console.error("Errore inserimento utente:", userError);
      return NextResponse.json({ error: `Errore nella registrazione.` }, { status: 500 });
    }

    // Aggiorna tabella PR con user_id
    const { error: prUpdateError } = await supabase
      .from('pr')
      .update({ user_id: insertedUsers.id })
      .eq('id', prData.id);

    if (prUpdateError) {
      console.error("Errore aggiornamento PR:", prUpdateError);
      return NextResponse.json({ error: `Errore nell'associazione con la tabella PR.` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registrazione avvenuta con successo!' }, { status: 200 });
  } catch (err) {
    console.error("Errore generico:", err);
    return NextResponse.json({ error: 'Errore interno del server.' }, { status: 500 });
  }
}
