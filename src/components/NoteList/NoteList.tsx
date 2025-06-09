import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import { Note, NotesResponse } from '../../types/note';

interface NoteListProps {
  page: number;
  limit: number;
  search: string;
}

export default function NoteList({ page, limit, search }: NoteListProps) {
  const { data, isLoading, isError } = useQuery<NotesResponse, Error>({
    queryKey: ['notes', page, limit, search],
    queryFn: () => fetchNotes(page, limit, search),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: page > 0 && limit > 0,
    placeholderData: prev => prev,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading notes</p>;

  const notes = data.results ?? [];

  return (
    <ul>
      {notes.map((note: Note) => (
        <li key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.text}</p>
          <small>{note.tag}</small>
        </li>
      ))}
    </ul>
  );
}
