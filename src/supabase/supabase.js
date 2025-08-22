import { createClient } from '@supabase/supabase-js';

// **Configuración de Supabase**
// Lee las variables de entorno para la URL y la clave.
// Asegúrate de que tu archivo .env tenga las variables VITE_SUPABASE_URL y VITE_SUPABASE_KEY.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
