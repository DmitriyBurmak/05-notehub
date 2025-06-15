import axios from 'axios';
import { Note, NotesResponse, CreateNotePayload } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${TOKEN}`,
});

export const fetchNotes = async (
  page: number,
  search: string
): Promise<NotesResponse> => {
  if (page < 1) {
    throw new Error('Page must be 1 or greater');
  }

  const params: Record<string, string | number> = { page };
  if (search.trim() !== '') {
    params.search = search.trim();
  }
  params.perPage = 12;
  const { data } = await axios.get<NotesResponse>(`${BASE_URL}/notes`, {
    params,
    headers: getAuthHeaders(),
  });

  return data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const { data } = await axios.post<Note>(`${BASE_URL}/notes`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const updateNote = async (payload: Note): Promise<Note> => {
  const { id, ...updateData } = payload;
  const { data } = await axios.put<Note>(
    `${BASE_URL}/notes/${id}`,
    updateData,
    {
      headers: getAuthHeaders(),
    }
  );
  return data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const { data } = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};
