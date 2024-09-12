import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, country } = await request.json();

    const { data, error } = await supabase
      .from('waitlist')
      .insert({ email, country });

    if (error) throw error;

    return NextResponse.json({ message: 'Added to waitlist successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json({ message: 'Error adding to waitlist' }, { status: 500 });
  }
}
