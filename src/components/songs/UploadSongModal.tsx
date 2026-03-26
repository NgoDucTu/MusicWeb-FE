"use client";

import { useState, useRef, useEffect } from "react";
import { getCategoryOptionsApi, uploadSongApi, type CategoryOption } from "@/lib/api/songs.api";
import { X, Upload, Music } from "lucide-react";
import type { Category } from "@/types";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadSongModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    title: "", artist: "", genre: "", category: "" as Category, description: "",
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCategoryOptionsApi().then((r) => {
      const opts = r.data ?? [];
      setCategoryOptions(opts);
      if (opts.length > 0) setForm((f) => ({ ...f, category: opts[0].value }));
    });
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!audioFile) { setError("Vui lòng chọn file MP3"); return; }
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", audioFile);
      if (thumbFile) fd.append("thumbnail", thumbFile);
      fd.append("title", form.title);
      fd.append("artist", form.artist);
      fd.append("genre", form.genre);
      fd.append("category", form.category);
      fd.append("description", form.description);
      const res = await uploadSongApi(fd);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || "Tải lên thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface-elevated rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">Tải lên bài hát</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <button type="button" onClick={() => audioRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-surface-hover rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-colors">
            <Music size={20} />
            {audioFile ? audioFile.name : "Chọn file MP3 *"}
          </button>
          <input ref={audioRef} type="file" accept="audio/mpeg,audio/mp3" className="hidden"
            onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} />

          <button type="button" onClick={() => thumbRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-surface-hover rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-colors text-sm">
            <Upload size={16} />
            {thumbFile ? thumbFile.name : "Chọn ảnh bìa (tùy chọn)"}
          </button>
          <input ref={thumbRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} />

          {[
            { label: "Tiêu đề *", key: "title" },
            { label: "Nghệ sĩ *", key: "artist" },
            { label: "Thể loại chi tiết", key: "genre" },
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
            <label className="block text-xs text-text-secondary mb-1">Danh mục</label>
            <select value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary">
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.display}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Mô tả</label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} className="w-full bg-surface-highlight px-4 py-2.5 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm">
            {loading ? "Đang tải lên..." : "Tải lên"}
          </button>
        </form>
      </div>
    </div>
  );
}
