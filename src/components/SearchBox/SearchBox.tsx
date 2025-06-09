import type { ChangeEvent, FormEvent } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onSearch: (query: string) => void;
  onChange: (value: string) => void;
}

export default function SearchBox({
  value,
  onSearch,
  onChange,
}: SearchBoxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className={css.searchBox} onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search notes..."
        className={css.input}
        aria-label="Search notes"
      />
      <button type="submit" className={css.button}>
        Search
      </button>
    </form>
  );
}
