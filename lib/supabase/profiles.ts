import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "./client";

/**
 * A registered user, mirrored from `auth.users` into the public `profiles`
 * table by a database trigger on signup.
 *
 * Profiles are publicly readable so the community of registered users can be
 * listed, while updates are restricted to the owner via Row Level Security.
 */
export interface Profile {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  provider: string | null;
  createdAt: string;
}

/** Shape of a row in the `profiles` table. */
interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  created_at: string;
}

function mapRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    provider: row.provider,
    createdAt: row.created_at,
  };
}

function getClient(client?: SupabaseClient): SupabaseClient {
  return client ?? createClient();
}

/** Every registered user, newest first. */
export async function getAllProfiles(client?: SupabaseClient): Promise<Profile[]> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProfileRow[]).map(mapRow);
}

/** A single profile by user id, or null when it does not exist. */
export async function getProfileById(
  id: string,
  client?: SupabaseClient,
): Promise<Profile | null> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as ProfileRow) : null;
}

/** Best-effort display name for a profile. */
export function getProfileName(profile: Profile): string {
  return (
    profile.fullName?.trim() ||
    profile.email?.split("@")[0] ||
    "Anonymous user"
  );
}

/** Two-letter initials for an avatar fallback. */
export function getProfileInitials(profile: Profile): string {
  const name = getProfileName(profile);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
