import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import NoteForm from '../NoteForm/NoteForm';
import css from './NoteModal.module.css';
import type { Note, CreateNotePayload } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, updateNote } from '../../services/noteService';
import { toast } from 'react-hot-toast';

interface NoteModalProps {
  onClose: () => void;
  note: Note | null;
}

export default function NoteModal({ onClose, note }: NoteModalProps) {
  const isNewNote = note === null;
  const queryClient = useQueryClient();

  const { mutate: addNote, isPending: isCreating } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note successfully created!');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Error creating a note: ${error.message}`);
    },
  });

  const { mutate: updateExistingNote, isPending: isUpdating } = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('The note has been successfully updated!');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Error updating a note: ${error.message}`);
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose();
  };

  const handleSubmit = (values: {
    title: string;
    content: string;
    tag: Note['tag'];
  }) => {
    if (isNewNote) {
      const newNotePayload: CreateNotePayload = {
        title: values.title,
        content: values.content,
        tag: values.tag,
      };
      addNote(newNotePayload);
    } else {
      const updatedNotePayload: Note = {
        id: note!.id,
        title: values.title,
        content: values.content,
        tag: values.tag,
      };
      updateExistingNote(updatedNotePayload);
    }
  };

  const initialFormValues = note
    ? {
        title: note.title,
        content: note.content,
        tag: note.tag,
      }
    : {
        title: '',
        content: '',
        tag: 'Todo' as Note['tag'],
      };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close the modal"
        >
          &times;
        </button>
        <h2 className={css.title}>
          {isNewNote ? 'Create a note' : 'Edit note'}
        </h2>
        <NoteForm
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    </div>,
    document.body
  );
}
