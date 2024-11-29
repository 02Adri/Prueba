import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ariyyolskksxmpygpeer.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyaXl5b2xza2tzeG1weWdwZWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NDg3NTQsImV4cCI6MjA0ODQyNDc1NH0.OPgAqRSKlNvgQquHnzETRQvbOtxRIUS_W5DsKLv03S8";
export const supabase = createClient(supabaseUrl, supabaseKey);
