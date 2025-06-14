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
import type { Note } from '../../types/note';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { data: notesData } = useNotes({ page, search: debouncedSearch });
  const totalPages = notesData?.totalPages || 1;

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleOpenCreateModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedNote(null);
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

          <Pagination
            page={page}
            onPageChange={setPage}
            search={debouncedSearch}
            totalPages={totalPages}
          />

          <button className={css.button} onClick={handleOpenCreateModal}>
            Create note +
          </button>
        </header>

        <NoteList
          page={page}
          search={debouncedSearch} 
          onNoteClick={handleNoteClick} 
        />

        
        {isModalOpen && (
          <NoteModal
            onClose={handleModalClose}
            note={selectedNote} 
          />
        )}

        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}
