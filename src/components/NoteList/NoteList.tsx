import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { toast } from 'react-hot-toast';
import Empty from '../Empty/Empty';
import { useState } from 'react';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingNoteIds, setDeletingNoteIds] = useState<Set<number>>(
    new Set()
  );
  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onMutate: async (id: number) => {
      setDeletingNoteIds(prev => new Set(prev).add(id));
    },
    onSuccess: deletedNote => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success(`Note "${deletedNote.title}" successfully deleted!`);
    },
    onError: (error: Error) => {
      toast.error(`Could not delete a note: ${error.message}`);
    },
    onSettled: (_data, _error, id) => {
      setDeletingNoteIds(prev => {
        const newState = new Set(prev);
        newState.delete(id);
        return newState;
      });
    },
  });

  if (notes.length === 0) {
    return <Empty />;
  }

  return (
    <ul className={css.list}>
      {notes.map(note => {
        const isDeletingThisNote = deletingNoteIds.has(note.id);
        return (
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
                disabled={isDeletingThisNote}
              >
                {isDeletingThisNote ? 'We remove...' : 'Delete'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
