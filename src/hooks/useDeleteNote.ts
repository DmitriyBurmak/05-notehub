import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../services/noteService';
import { toast } from 'react-hot-toast';

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Нотатку успішно видалено!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: Error) => {
      toast.error(`Не вдалося видалити нотатку: ${error.message}`);
    },
  });
};
