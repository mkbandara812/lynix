import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://ppredshlgdmxvttwwjef.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcmVkc2hsZ2RteHZ0dHd3amVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTc0NzYsImV4cCI6MjA5MDM3MzQ3Nn0.eglt9ui-aO04sWBsZnHr0e8EztGOfeZq_C72gMTjg3Q'
);
