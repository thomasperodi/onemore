import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Recupera l'utente dalla tabella users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, nome, cognome, password, ruolo')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Utente non trovato.' }, { status: 404 });
    }

    // Verifica la password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Password errata.' }, { status: 401 });
    }

    // Recupera l'ID del PR associato all'utente
    const { data: pr, error: prError } = await supabase
      .from('pr')
      .select('id')
      .eq('nome', user.nome)
      .eq('cognome', user.cognome)
      .single();

    if (prError) {
      console.warn("Nessun PR associato trovato per l'utente, procedendo senza pr_id.");
    }

    // Creazione del token JWT con id utente, ruolo, nome e pr_id (se disponibile)
    const tokenPayload = {
      id: user.id,
      role: user.ruolo,
      nome: user.nome,
      pr_id: pr ? pr.id : null, // Aggiunge pr_id solo se esiste
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1h' });

    const response = NextResponse.json({ message: 'Login effettuato con successo!' }, { status: 200 });
    response.cookies.set('token', token, { httpOnly: false, maxAge: 3600, path: '/' });

    return response;
  } catch (error) {
    console.error('Errore interno del server:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
