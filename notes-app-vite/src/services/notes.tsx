import axios from "axios";
import { Note, Version } from "../types";

export async function getAllNotes(): Promise<Note[]> {
  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get("http://localhost:8080/notes", {
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
      "http://localhost:8080/notes",
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
      `http://localhost:8080/notes/${noteId}`,
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

    const response = await axios.delete(
      `http://localhost:8080/notes/${noteId}`,
      { headers }
    );
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

    const response = await axios.get(
      `http://localhost:8080/version/notes/${noteId}`,
      { headers }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching notes version:", error);
    throw error;
  }
}
