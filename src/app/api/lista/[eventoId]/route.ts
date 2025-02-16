import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function GET(req: Request, { params }: { params: { eventoId: string } }) {
    const { data, error } = await supabase.from('lista').select('*').eq('evento_id', params.eventoId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }
  