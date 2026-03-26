import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";
import { uploadAvatarApi, userAvatarUrl } from "@/lib/api/users.api";
import { ROLE_LABELS } from "@/common/constant";
import type { UserResponse } from "@/types";

interface Props {
  user: UserResponse;
  onUploaded: () => Promise<void>;
}

export default function ProfileAvatar({ user, onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      await uploadAvatarApi(fd);
      await onUploaded();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-surface-highlight">
          {user.avatarUrl ? (
            <Image
              src={userAvatarUrl(user.id)}
              alt={user.username}
              width={112}
              height={112}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-text-muted">
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-black hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          <Camera size={14} />
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <h2 className="text-xl font-semibold mt-3">{user.username}</h2>
      <p className="text-text-secondary text-sm">{user.email}</p>
      <span className="mt-2 text-xs px-3 py-1 rounded-full bg-surface-highlight text-text-secondary">
        {ROLE_LABELS[user.role] ?? user.role}
      </span>
    </div>
  );
}
