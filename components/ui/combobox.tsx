"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  /** Show the search input inside the popover. Defaults to true. */
  searchable?: boolean;
}

/**
 * Searchable dropdown styled to match the site's form fields.
 * The search input lives inside the popover and filters the options live.
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches found",
  className,
  searchable = true,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!searchable) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.toLowerCase().includes(q));
  }, [options, query, searchable]);

  // Close when clicking outside of the combobox.
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  // Focus the search field whenever the popover opens (only when searchable).
  useEffect(() => {
    if (open && searchable) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open, searchable]);

  function handleSelect(option: string) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "mt-2 flex h-11 w-full items-center justify-between rounded-md border bg-white px-3 text-left text-sm outline-none transition-colors focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15",
          open ? "border-emerald-700 ring-2 ring-emerald-700/15" : "border-stone-300",
        )}
      >
        <span className={cn("truncate", value ? "text-stone-900" : "text-stone-400")}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-stone-400 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-stone-200 bg-white shadow-lg">
          {searchable && (
            <div className="relative border-b border-stone-100 p-2">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-md border border-stone-300 bg-white pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
              />
            </div>
          )}

          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map((option) => {
                const isSelected = option === value;
                return (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-emerald-50 font-medium text-emerald-900"
                          : "text-stone-700 hover:bg-stone-50 hover:text-emerald-800",
                      )}
                    >
                      <span className="truncate">{option}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-sm text-stone-500">{emptyText}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
