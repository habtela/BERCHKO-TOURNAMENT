const SUPABASE_URL = "https://ddbtrhhtokcdknuhwykr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_i913YNO0dy8iqHXP8GarhA_IEMxYEVU";

const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
window.client =client;