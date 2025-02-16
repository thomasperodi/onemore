// API di registrazione con controllo nome e cognome esistenti e hashing della password
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { nome, cognome, username, password } = await request.json();

  const { data, error } = await supabase
    .from('pr')
    .select('*')
    .eq('nome', nome)
    .eq('cognome', cognome)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Nome e cognome non trovati nella lista PR.' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error: userError } = await supabase.from('users').insert([
    { nome, cognome, username, password: hashedPassword, ruolo: 'pr' }
  ]);

  if (userError) {
    return NextResponse.json({ error: 'Errore nella registrazione.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Registrazione avvenuta con successo!' }, { status: 200 });
}