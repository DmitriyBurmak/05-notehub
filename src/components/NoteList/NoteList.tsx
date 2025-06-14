import { useNotes } from '../../hooks/useNotes';
import { useDeleteNote } from '../../hooks/useDeleteNote';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { toast } from 'react-hot-toast';
import Empty from '../Empty/Empty';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

interface NoteListProps {
  page: number;
  search: string;
  onNoteClick: (note: Note) => void;
}

export default function NoteList({ page, search, onNoteClick }: NoteListProps) {
  const { data, isLoading, isError, error } = useNotes({ page, search });
  const { mutate: deleteNote } = useDeleteNote();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  if (!data || data.notes.length === 0) {
    return <Empty />;
  }

  return (
    <ul className={css.list}>
      {data.notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title} onClick={() => onNoteClick(note)}>
            {note.title}
          </h2>
          <p className={css.content}>{note.content}</p>{' '}
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                deleteNote(note.id);
                toast.success('Deletion request sent!');
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
