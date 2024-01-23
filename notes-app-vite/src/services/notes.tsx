import axios from "axios";
import { Note, Version } from "../types";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getAllNotes(): Promise<Note[]> {
  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${apiUrl}/notes`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error getAllNotes:", error);
    throw error;
  }
}

export async function createNote(title: string, content: string) {
  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.post(
      `${apiUrl}/notes`,
      { title, content },
      { headers }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

export async function updateNote(
  noteId: string,
  title: string,
  content: string
): Promise<Note> {
  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.put(
      `${apiUrl}/notes/${noteId}`,
      { title, content },
      { headers }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

export async function deleteNote(noteId: string) {
  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.delete(`${apiUrl}/notes/${noteId}`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

export async function getNoteVersion(noteId: string): Promise<Version[]> {
  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`${apiUrl}/version/notes/${noteId}`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching notes version:", error);
    throw error;
  }
}
