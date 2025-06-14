export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  total: number;
  page: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}
