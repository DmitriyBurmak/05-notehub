import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { toast } from 'react-hot-toast';
import Empty from '../Empty/Empty';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: deletedNote => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success(`Note "${deletedNote.title}" successfully deleted!`);
    },
    onError: (error: Error) => {
      toast.error(`Could not delete a note: ${error.message}`);
    },
  });

  if (notes.length === 0) {
    return <Empty />;
  }

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                deleteMutation(note.id);
              }}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
