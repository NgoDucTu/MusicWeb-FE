"use client";

import { useState, useEffect, useCallback } from "react";
import { searchSongsApi, getSongsByCategoryApi } from "@/lib/api/songs.api";
import { getCategoriesApi, type CategoryResponse } from "@/lib/api/categories.api";
import type { SongResponse } from "@/types";
import SongRow from "@/components/songs/SongRow";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";
import { Search } from "lucide-react";

const PALETTE = [
  "bg-teal-700", "bg-indigo-600", "bg-orange-600", "bg-blue-700",
  "bg-pink-600", "bg-purple-700", "bg-yellow-700", "bg-rose-600",
  "bg-green-700", "bg-slate-600", "bg-cyan-700", "bg-zinc-600",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SongResponse[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryResponse[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryResults, setCategoryResults] = useState<SongResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongResponse | null>(null);

  useEffect(() => {
    getCategoriesApi().then((r) => setCategoryOptions(r.data ?? []));
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await searchSongsApi(q.trim());
      setResults(res.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const handleCategory = async (id: string) => {
    if (activeCategory === id) {
      setActiveCategory(null);
      setCategoryResults([]);
      return;
    }
    setActiveCategory(id);
    const res = await getSongsByCategoryApi(id);
    setCategoryResults(res.data ?? []);
  };

  const showResults = query.trim().length > 0;
  const activeCategoryLabel = categoryOptions.find((o) => o.id === activeCategory)?.displayName ?? activeCategory;

  return (
    <div className="pb-24 space-y-8">
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder="Search songs, artists..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-highlight rounded-full text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary transition" />
      </div>

      {showResults ? (
        <section>
          <h2 className="text-xl font-bold mb-3">Search results</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-text-muted text-sm py-6">No results found</p>
          ) : (
            <div className="space-y-1">
              {results.map((song, i) => (
                <SongRow key={song.id} song={song} index={i} queue={results}
                  onAddToPlaylist={(s) => setSelectedSong(s)} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-bold mb-4">Browse by category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categoryOptions.map((opt, i) => (
                <button key={opt.id} onClick={() => handleCategory(opt.id)}
                  className={`${PALETTE[i % PALETTE.length]} rounded-lg p-5 text-left font-semibold text-sm hover:opacity-90 transition-opacity ${activeCategory === opt.id ? "ring-2 ring-white" : ""}`}>
                  {opt.displayName}
                </button>
              ))}
            </div>
          </section>

          {activeCategory && categoryResults.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">{activeCategoryLabel}</h2>
              <div className="space-y-1">
                {categoryResults.map((song, i) => (
                  <SongRow key={song.id} song={song} index={i} queue={categoryResults}
                    onAddToPlaylist={(s) => setSelectedSong(s)} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {selectedSong && (
        <AddToPlaylistModal song={selectedSong} onClose={() => setSelectedSong(null)} />
      )}
    </div>
  );
}
