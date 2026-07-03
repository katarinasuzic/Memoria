import { supabase } from '@/lib/supabase';
import type { LibraryItem, NewLibraryItem } from '@/services/types';

export async function fetchLibrary(): Promise<LibraryItem[]> {
  const { data, error } = await supabase
    .from('library_items')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as LibraryItem[];
}

export async function addLibraryItem(input: NewLibraryItem): Promise<LibraryItem> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('You must be signed in to add to your library.');

  const { data, error } = await supabase
    .from('library_items')
    .upsert(
      { ...input, user_id: user.id },
      { onConflict: 'user_id,media_type,external_id' },
    )
    .select()
    .single();
  if (error) throw error;
  return data as LibraryItem;
}

export async function fetchLibraryItem(id: string): Promise<LibraryItem | null> {
  const { data, error } = await supabase.from('library_items').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as LibraryItem) ?? null;
}

export async function toggleFavorite(id: string, value: boolean): Promise<void> {
  const { error } = await supabase.from('library_items').update({ is_favorite: value }).eq('id', id);
  if (error) throw error;
}

export async function removeLibraryItem(id: string): Promise<void> {
  const { error } = await supabase.from('library_items').delete().eq('id', id);
  if (error) throw error;
}

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export async function fetchProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  return (data as Profile) ?? null;
}
