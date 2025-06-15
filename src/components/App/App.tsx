import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, useNotes } from '../../hooks/useNotes';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import NoteModal from '../NoteModal/NoteModal';
import css from './App.module.css';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: notesData,
    isLoading,
    isError,
  } = useNotes({ page, search: debouncedSearch });
  const totalPages = notesData?.totalPages || 1;

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOpenCreateModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox
            value={search}
            onChange={(value: string) => {
              setSearch(value);
              setPage(1);
            }}
          />

          {totalPages > 1 && (
            <Pagination
              page={page}
              onPageChange={setPage}
              totalPages={totalPages}
            />
          )}

          <button className={css.button} onClick={handleOpenCreateModal}>
            Create note +
          </button>
        </header>

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {!isLoading && !isError && notesData?.notes.length === 0 && <Loader />}

        {!isLoading && !isError && notesData && notesData.notes.length > 0 && (
          <NoteList notes={notesData.notes} />
        )}

        {isModalOpen && <NoteModal onClose={handleModalClose} />}

        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}
