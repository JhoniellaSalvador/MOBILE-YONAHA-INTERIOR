/* ==========================================================
   SUPABASE
========================================================== */

console.log("supabase.js loaded");

/* ==========================================================
   CONFIG
========================================================== */

const SUPABASE_URL =
"https://ninggtzdnxcdrqvcgmzc.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable__C3whdGBmB3YrS8pKhjUAA_PM27pjoF";

/* ==========================================================
   CREATE CLIENT
========================================================== */

const db = supabase.createClient(

    SUPABASE_URL,

    SUPABASE_PUBLISHABLE_KEY

);

window.db = db;

console.log("Supabase Connected ✅");
