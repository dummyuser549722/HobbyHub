import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://duysukjemybopgetcacy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eXN1a2plbXlib3BnZXRjYWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzODQ0MjUsImV4cCI6MjA2MDk2MDQyNX0.EQeM1fRcC0XGZJhe74-dromUrGnQ7Ithptj5DnTOEPw'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;