"use client";

import { useState, useEffect } from "react";
import { editSongApi } from "@/lib/api/songs.api";
import { getCategoriesApi, type CategoryResponse } from "@/lib/api/categories.api";
import { X } from "lucide-react";
import { SongResponse } from "@/types";

interface Props {
  song: SongResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditSongModal({ song, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    title: song.title,
    artist: song.artist ?? "",
    category: song.category ?? "",
    description: song.description ?? "",
  });
  const [categoryOptions, setCategoryOptions] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategoriesApi().then((r) => {
      setCategoryOptions(r.data ?? []);
    });
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await editSongApi(song.id, {
        title: form.title || undefined,
        artist: form.artist,
        category: form.category,
        description: form.description,
      });
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || "Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface-elevated rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">Edit song info</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1">Title *</label>
            <input type="text" value={form.title} required
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Artist</label>
            <input type="text" value={form.artist}
              onChange={(e) => setForm({ ...form, artist: e.target.value })}
              className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Category</label>
            <select value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary">
              <option value="">— None —</option>
              {categoryOptions.map((opt) => (
                <option key={opt.id} value={opt.name}>{opt.displayName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Description</label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm">
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
