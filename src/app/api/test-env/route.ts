import supabase from '../../../../supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Prøver å koble til Supabase...');
    const { data, error } = await supabase.from('test').select('*');
    
    if (error) {
      console.error('Feil ved henting av data:', error);
      throw error;
    }

    if (data.length === 0) {
      console.log('Ingen data funnet i test-tabellen.');
      return NextResponse.json({
        success: true,
        message: 'Ingen data funnet.',
        data: [],
      });
    }

    console.log('Data hentet:', data);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Feil i GET-forespørsel:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Ukjent feil'
    }, { status: 500 });
  }
}
