"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  getAllProfiles,
  getProfileInitials,
  getProfileName,
  type Profile,
} from "@/lib/supabase/profiles";

/**
 * Lists every registered user from the public `profiles` table.
 *
 * Profiles are created automatically by a database trigger on signup, so this
 * list always reflects everyone who has signed in (e.g. via Google).
 */
export function UsersList() {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);

  useEffect(() => {
    let active = true;

    getAllProfiles()
      .then((result) => {
        if (active) setProfiles(result);
      })
      .catch(() => {
        if (active) setProfiles([]);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!profiles) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-stone-200" aria-hidden="true" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-stone-100"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-800" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-stone-950">Registered users</h2>
        </div>
        <Badge variant="muted">{profiles.length}</Badge>
      </div>

      {profiles.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-stone-600">
          No registered users yet. Be the first to sign in.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-100">
          {profiles.map((profile) => (
            <li key={profile.id} className="flex items-center gap-3 py-3">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
                  {getProfileInitials(profile)}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-stone-950">
                  {getProfileName(profile)}
                </p>
                {profile.email && (
                  <p className="truncate text-xs text-stone-500">{profile.email}</p>
                )}
              </div>

              {profile.provider && (
                <Badge variant="outline" className="shrink-0 capitalize">
                  {profile.provider}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
