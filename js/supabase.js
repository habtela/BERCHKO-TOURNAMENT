import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ddbtrhhtokcdknuhwykr.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_i913YNO0dy8iqHXP8GarhA_IEMxYEVU";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
window.client = supabase