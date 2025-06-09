import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes } from '../services/noteService';
import type { NotesResponse } from '../types/note';

interface UseNotesParams {
  page: number;
  search: string;
}

export const useNotes = ({ page, search }: UseNotesParams) => {
  const queryClient = useQueryClient();

  return useQuery<NotesResponse>({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, 10, search),
    staleTime: 1000 * 60,
    retry: 1,
    placeholderData: () => {
      if (page > 1) {
        return queryClient.getQueryData<NotesResponse>([
          'notes',
          page - 1,
          search,
        ]);
      }
      return undefined;
    },
  });
};
