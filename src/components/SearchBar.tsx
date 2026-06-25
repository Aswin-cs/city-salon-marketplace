'use client';

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term.trim());
    } else {
      params.delete("search");
    }
    
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        handleSearch(query); 
      }} 
      className="relative max-w-2xl w-full flex items-center bg-white border border-rose-100/60 rounded-full p-1.5 shadow-sm focus-within:shadow-md focus-within:border-rose-300 transition-all duration-300"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for salon name, service, or neighborhood..."
        className="w-full pl-5 pr-14 py-3 bg-transparent text-emerald-950 placeholder:text-emerald-900/40 text-sm md:text-base focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="absolute right-2 p-3 bg-emerald-900 text-white rounded-full hover:bg-emerald-800 transition-colors shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Search"
      >
        <Search className={`w-4 h-4 md:w-5 h-5 ${isPending ? 'animate-pulse' : ''}`} />
      </button>
    </form>
  );
}
