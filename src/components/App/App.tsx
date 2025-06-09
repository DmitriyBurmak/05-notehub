import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Toaster } from 'react-hot-toast';

import NoteList from '../NoteList/NoteList';
import PaginationWrapper from '../Pagination/PaginationWrapper';
import SearchBox from '../SearchBox/SearchBox';
import NoteModal from '../NoteModal/NoteModal';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      <Toaster position="top-right" />

      <button className="createButton" onClick={() => setIsModalOpen(true)}>
        Create note +
      </button>

      <SearchBox value={search} onChange={setSearch} onSearch={handleSearch} />
      <NoteList page={page} search={debouncedSearch} />
      <PaginationWrapper page={page} search={search} onPageChange={setPage} />

      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
