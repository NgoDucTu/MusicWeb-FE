"use client";

import { useState, useEffect, useCallback } from "react";
import { searchSongsApi, getCategoryOptionsApi, getSongsByCategoryApi, type CategoryOption } from "@/lib/api/songs.api";
import type { SongResponse } from "@/types";
import SongRow from "@/components/songs/SongRow";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";
import { Search } from "lucide-react";
import { CATEGORY_COLORS } from "@/common/constant";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SongResponse[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryResults, setCategoryResults] = useState<SongResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongResponse | null>(null);

  useEffect(() => {
    getCategoryOptionsApi().then((r) => setCategoryOptions(r.data ?? []));
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

  const handleCategory = async (value: string) => {
    if (activeCategory === value) {
      setActiveCategory(null);
      setCategoryResults([]);
      return;
    }
    setActiveCategory(value);
    const res = await getSongsByCategoryApi(value);
    setCategoryResults(res.data ?? []);
  };

  const showResults = query.trim().length > 0;
  const activeCategoryLabel = categoryOptions.find((o) => o.value === activeCategory)?.display ?? activeCategory;

  return (
    <div className="pb-24 space-y-8">
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder="Tìm bài hát, nghệ sĩ..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-highlight rounded-full text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary transition" />
      </div>

      {showResults ? (
        <section>
          <h2 className="text-xl font-bold mb-3">Kết quả tìm kiếm</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-text-muted text-sm py-6">Không tìm thấy kết quả nào</p>
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
            <h2 className="text-xl font-bold mb-4">Duyệt theo thể loại</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categoryOptions.map((opt) => (
                <button key={opt.value} onClick={() => handleCategory(opt.value)}
                  className={`${CATEGORY_COLORS[opt.value] ?? "bg-slate-600"} rounded-lg p-5 text-left font-semibold text-sm hover:opacity-90 transition-opacity ${activeCategory === opt.value ? "ring-2 ring-white" : ""}`}>
                  {opt.display}
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
