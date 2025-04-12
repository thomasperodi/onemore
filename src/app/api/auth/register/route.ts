import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { nome, cognome, username, email, password } = await request.json();

    // Controlla se il PR esiste nella lista PR
    const { data: prData, error: prError } = await supabase
      .from('pr')
      .select('*')
      .eq('nome', nome)
      .eq('cognome', cognome)
      .single();

    if (prError || !prData) {
      return NextResponse.json({ error: 'Nome e cognome non trovati nella lista PR.' }, { status: 400 });
    }

    // Controlla se l'username o l'email sono già registrati
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

    // Inserisci il nuovo utente
    const { error: userError } = await supabase.from('users').insert([
      { nome, cognome, username, email, password: hashedPassword, ruolo: 'pr' }
    ]);

    if (userError) {
      console.error("Errore Supabase:", userError);
      return NextResponse.json({ error: `Errore nella registrazione: ${userError.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registrazione avvenuta con successo!' }, { status: 200 });

  } catch (err) {
    console.error("Errore generico:", err);
    return NextResponse.json({ error: 'Errore interno del server.' }, { status: 500 });
  }
}
