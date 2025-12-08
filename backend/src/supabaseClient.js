import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn("Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY missing in environment.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
