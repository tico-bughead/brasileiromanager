
import { createClient } from '@supabase/supabase-js';

// As credenciais devem ser fornecidas via variáveis de ambiente
// Assume-se que o Supabase foi configurado com uma tabela 'championships'
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseChampionship {
  id: string;
  name: string;
  type: string;
  teams: any;
  matches: any;
  status: string;
  created_at?: string;
}

export const syncChampionshipToCloud = async (champ: any) => {
  try {
    const { error } = await supabase
      .from('championships')
      .upsert({
        id: champ.id,
        name: champ.name,
        type: champ.type,
        teams: champ.teams,
        matches: champ.matches,
        status: champ.status,
      });
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Supabase Sync Error (check your credentials):", err);
    return false;
  }
};

export const fetchChampionshipsFromCloud = async () => {
  try {
    const { data, error } = await supabase
      .from('championships')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Supabase Fetch Error:", err);
    return null;
  }
};

export const deleteChampionshipFromCloud = async (id: string) => {
  try {
    const { error } = await supabase
      .from('championships')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Supabase Delete Error:", err);
    return false;
  }
};
