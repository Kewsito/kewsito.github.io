import { createClient } from "@supabase/supabase-js";

// Obtener variables de entorno con valores por defecto
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://cfiaagdhclfziifgxcxu.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWFhZ2RoY2xmemlpZmd4Y3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Njc5NDQsImV4cCI6MjA2OTA0Mzk0NH0.qoQfCiqe5kjs1XVwx0ZWrSYIQWBqvkewKT-0zwP1cCg';

// Validar que las variables existan
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing. Please check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);