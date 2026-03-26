import type { SongResponse } from "@/types";
import SongRow from "@/components/songs/SongRow";

interface Props {
  songs: SongResponse[];
  onDelete: (song: SongResponse) => void;
}

export default function AdminSongsTab({ songs, onDelete }: Props) {
  if (songs.length === 0) {
    return <p className="text-text-muted text-sm py-10 text-center">Chưa có bài hát nào</p>;
  }

  return (
    <div className="space-y-1">
      {songs.map((song, i) => (
        <SongRow
          key={song.id}
          song={song}
          index={i}
          queue={songs}
          showDelete
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
