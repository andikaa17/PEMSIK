import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://maehsijminhyaofbswzx.supabase.co";
const supabaseKey = "sb_publishable_Uk9SD2E6gxXZPMa18hLGDA_YIJRT_w7";

export const supabase = createClient(supabaseUrl, supabaseKey);
