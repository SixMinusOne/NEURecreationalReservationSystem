import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wybnmyogimojsutlcyjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Ym5teW9naW1vanN1dGxjeWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTUyNjUsImV4cCI6MjA1NjY3MTI2NX0.IcACYU4h81RyC6Nr93NRi8_rQdUNuvTqp7dF2YRuANU';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;
