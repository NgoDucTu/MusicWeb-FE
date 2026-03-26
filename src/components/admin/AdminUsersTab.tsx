import type { UserResponse } from "@/types";

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  ADMIN: { label: "Admin", className: "bg-primary/20 text-primary" },
  USER: { label: "User", className: "bg-blue-500/20 text-blue-400" },
  GHOST: { label: "Ghost", className: "bg-red-500/20 text-red-400" },
};

interface Props {
  users: UserResponse[];
}

export default function AdminUsersTab({ users }: Props) {
  if (users.length === 0) {
    return <p className="text-text-muted text-sm py-10 text-center">Chưa có người dùng nào</p>;
  }

  return (
    <div className="space-y-2">
      {users.map((u) => {
        const badge = ROLE_BADGE[u.role] ?? {
          label: u.role,
          className: "bg-surface-highlight text-text-secondary",
        };
        return (
          <div key={u.id} className="flex items-center gap-4 px-4 py-3 bg-surface-elevated rounded-lg">
            <div className="w-9 h-9 rounded-full bg-surface-highlight flex items-center justify-center text-sm font-medium shrink-0">
              {u.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{u.username}</p>
              <p className="text-xs text-text-secondary truncate">{u.email}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${badge.className}`}>
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
