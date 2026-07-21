import { supabase } from "./supabase.js";

const { data, error } = await supabase.auth.getSession();

if (!data.session) {
    window.location.href = "admin-login.html";
}