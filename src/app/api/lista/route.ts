import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const { evento_id, pr_id, nome, cognome } = await req.json();
  
    const { data, error } = await supabase
      .from('lista')
      .insert([{ evento_id, pr_id, nome, cognome }]);
  
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Utente aggiunto alla lista', data });
  }