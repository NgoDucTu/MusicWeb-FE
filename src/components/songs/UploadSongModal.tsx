"use client";

import { useState, useRef, useEffect } from "react";
import { uploadSongApi } from "@/lib/api/songs.api";
import { getCategoriesApi, type CategoryResponse } from "@/lib/api/categories.api";
import { X, Upload, Music } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadSongModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    title: "", artist: "", category: "", description: "",
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCategoriesApi().then((r) => {
      const opts = r.data ?? [];
      setCategoryOptions(opts);
      if (opts.length > 0) setForm((f) => ({ ...f, category: opts[0].name }));
    });
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!audioFile) { setError("Please select an MP3 file"); return; }
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", audioFile);
      if (thumbFile) fd.append("thumbnail", thumbFile);
      fd.append("title", form.title);
      fd.append("artist", form.artist);
      fd.append("category", form.category);
      fd.append("description", form.description);
      const res = await uploadSongApi(fd);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || "Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface-elevated rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">Upload song</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <button type="button" onClick={() => audioRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-surface-hover rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-colors">
            <Music size={20} />
            {audioFile ? audioFile.name : "Select MP3 file *"}
          </button>
          <input ref={audioRef} type="file" accept="audio/mpeg,audio/mp3" className="hidden"
            onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} />

          <button type="button" onClick={() => thumbRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-surface-hover rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-colors text-sm">
            <Upload size={16} />
            {thumbFile ? thumbFile.name : "Select cover image (optional)"}
          </button>
          <input ref={thumbRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} />

          {[
            { label: "Title *", key: "title" },
            { label: "Artist *", key: "artist" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-text-secondary mb-1">{label}</label>
              <input type="text" value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={label.includes("*")}
                className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary" />
            </div>
          ))}

          <div>
            <label className="block text-xs text-text-secondary mb-1">Category</label>
            <select value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary">
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
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
