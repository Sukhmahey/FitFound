import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Only create client if both URL and key are provided
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
} else {
  console.warn("⚠️ Supabase credentials are missing. Please add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your .env file");
  // Create a mock client object to prevent crashes
  supabase = {
    storage: {
      from: (bucket) => ({
        upload: (filePath, file) => Promise.resolve({ 
          data: null, 
          error: { message: "Supabase not configured. Please add credentials to .env file" } 
        }),
        getPublicUrl: (filePath) => ({ 
          data: { publicUrl: "" } 
        }),
      }),
    },
  };
}

export { supabase };
