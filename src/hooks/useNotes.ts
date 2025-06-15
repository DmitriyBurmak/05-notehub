import { useQuery, useQueryClient, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '../services/noteService';
import type { NotesResponse } from '../types/note';

export const queryClient = new QueryClient();

interface UseNotesParams {
  page: number;
  search: string;
}

export const useNotes = ({ page, search }: UseNotesParams) => {
  const queryClientInstance = useQueryClient();

  return useQuery<NotesResponse>({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
    staleTime: 1000 * 60,
    retry: 1,
    placeholderData: previousData => {
      void previousData;
      if (page > 1) {
        return queryClientInstance.getQueryData<NotesResponse>([
          'notes',
          page - 1,
          search,
        ]);
      }
      return undefined;
    },
  });
};
