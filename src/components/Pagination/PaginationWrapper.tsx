import Pagination from './Pagination';
import { useNotes } from '../../hooks/useNotes';

interface PaginationWrapperProps {
  page: number;
  search: string;
  onPageChange: (selected: number) => void;
}

export default function PaginationWrapper({
  page,
  search,
  onPageChange,
}: PaginationWrapperProps) {
  const { data } = useNotes({ page, search });

  if (!data || data.totalPages <= 1) return null;

  return (
    <Pagination
      pageCount={data.totalPages}
      currentPage={page}
      onPageChange={onPageChange}
    />
  );
}
