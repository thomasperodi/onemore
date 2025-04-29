import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Recupera il singolo evento tramite Supabase
  const { data: event, error } = await supabase
    .from('eventi')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Errore API evento by ID:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!event) {
    return NextResponse.json({ message: 'Evento non trovato' }, { status: 404 });
  }

  return NextResponse.json(event);
}
