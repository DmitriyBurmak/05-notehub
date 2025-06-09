export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  text: string;
  tag: NoteTag;
}

export interface NotesResponse {
  results: Note[];
  totalPages: number;
  total: number;
  page: number;
  limit: number;
}

export interface CreateNotePayload {
  title: string;
  text: string;
  tag: NoteTag;
}
