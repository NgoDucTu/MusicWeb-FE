type AdminTab = "songs" | "users" | "categories";

interface Props {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}

const TAB_LABELS: Record<AdminTab, string> = {
  songs: "Bài hát",
  users: "Người dùng",
  categories: "Thể loại",
};

export default function AdminTabBar({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {(["songs", "users", "categories"] as const).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            active === t
              ? "bg-white text-black"
              : "bg-surface-highlight text-text-secondary hover:text-text-primary"
          }`}
        >
          {TAB_LABELS[t]}
        </button>
      ))}
    </div>
  );
}
