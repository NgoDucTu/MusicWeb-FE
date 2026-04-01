"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import {
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  type CategoryResponse,
} from "@/lib/api/categories.api";

interface Props {
  categories: CategoryResponse[];
  onChange: (categories: CategoryResponse[]) => void;
}

interface EditState {
  id: string;
  name: string;
  displayName: string;
}

export default function AdminCategoriesTab({ categories, onChange }: Props) {
  const [editing, setEditing] = useState<EditState | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDisplay, setNewDisplay] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const startAdd = () => {
    setAdding(true);
    setNewName("");
    setNewDisplay("");
    setError(null);
  };

  const cancelAdd = () => {
    setAdding(false);
    setError(null);
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newDisplay.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await createCategoryApi({ name: newName.trim(), displayName: newDisplay.trim() });
    setBusy(false);
    if (!res.success) { setError(res.message); return; }
    onChange([...categories, res.data!]);
    setAdding(false);
  };

  const startEdit = (cat: CategoryResponse) => {
    setEditing({ id: cat.id, name: cat.name, displayName: cat.displayName });
    setError(null);
  };

  const cancelEdit = () => { setEditing(null); setError(null); };

  const handleEdit = async () => {
    if (!editing || !editing.name.trim() || !editing.displayName.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await updateCategoryApi(editing.id, { name: editing.name.trim(), displayName: editing.displayName.trim() });
    setBusy(false);
    if (!res.success) { setError(res.message); return; }
    onChange(categories.map((c) => (c.id === editing.id ? res.data! : c)));
    setEditing(null);
  };

  const handleDelete = async (cat: CategoryResponse) => {
    if (!confirm(`Delete category "${cat.displayName}"?`)) return;
    setBusy(true);
    const res = await deleteCategoryApi(cat.id);
    setBusy(false);
    if (!res.success) { alert(res.message); return; }
    onChange(categories.filter((c) => c.id !== cat.id));
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-red-400 text-sm px-1">{error}</p>
      )}

      <div className="rounded-lg overflow-hidden border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-highlight text-text-secondary text-left">
              <th className="px-4 py-3 font-medium w-8">#</th>
              <th className="px-4 py-3 font-medium">Name (key)</th>
              <th className="px-4 py-3 font-medium">Display name</th>
              <th className="px-4 py-3 font-medium w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat, i) => (
              <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                {editing?.id === cat.id ? (
                  <>
                    <td className="px-4 py-2 text-text-muted">{i + 1}</td>
                    <td className="px-4 py-2">
                      <input
                        className="w-full bg-surface-highlight rounded px-2 py-1 text-text-primary outline-none focus:ring-1 focus:ring-primary text-sm"
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        className="w-full bg-surface-highlight rounded px-2 py-1 text-text-primary outline-none focus:ring-1 focus:ring-primary text-sm"
                        value={editing.displayName}
                        onChange={(e) => setEditing({ ...editing, displayName: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={handleEdit} disabled={busy}
                          className="text-primary hover:text-primary-dark disabled:opacity-50">
                          <Check size={16} />
                        </button>
                        <button onClick={cancelEdit} disabled={busy}
                          className="text-text-muted hover:text-text-primary disabled:opacity-50">
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-text-muted">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">{cat.name}</td>
                    <td className="px-4 py-3 text-text-primary">{cat.displayName}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => startEdit(cat)} disabled={busy}
                          className="text-text-muted hover:text-text-primary disabled:opacity-50">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(cat)} disabled={busy}
                          className="text-text-muted hover:text-red-400 disabled:opacity-50">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {adding && (
              <tr className="bg-white/5">
                <td className="px-4 py-2 text-text-muted">{categories.length + 1}</td>
                <td className="px-4 py-2">
                  <input
                    placeholder="VD: MORNING_CALM"
                    className="w-full bg-surface-highlight rounded px-2 py-1 text-text-primary outline-none focus:ring-1 focus:ring-primary text-sm placeholder:text-text-muted"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    placeholder="VD: Morning Calm"
                    className="w-full bg-surface-highlight rounded px-2 py-1 text-text-primary outline-none focus:ring-1 focus:ring-primary text-sm placeholder:text-text-muted"
                    value={newDisplay}
                    onChange={(e) => setNewDisplay(e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={handleAdd} disabled={busy}
                      className="text-primary hover:text-primary-dark disabled:opacity-50">
                      <Check size={16} />
                    </button>
                    <button onClick={cancelAdd} disabled={busy}
                      className="text-text-muted hover:text-text-primary disabled:opacity-50">
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!adding && (
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-highlight text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
        >
          <Plus size={15} />
          Add category
        </button>
      )}
    </div>
  );
}
