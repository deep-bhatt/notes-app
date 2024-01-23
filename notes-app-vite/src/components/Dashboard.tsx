import { Fragment, useEffect, useState } from "react";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "../services/notes";
import { Note } from "../types";
import { useNavigate } from "react-router-dom";
import { getUserName } from "../services/auth";

function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    getAllNotes().then((notes) => {
      setNotes(notes);
    });
  }, []);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) return;

    console.log("handleUpdateNote: ", selectedNote);
    const updatedNote = await updateNote(selectedNote.id, title, content);

    const updatedNodeList: Note[] = notes.filter((note) => {
      return note.id === updatedNote.id ? false : true;
    });

    setNotes([updatedNote, ...updatedNodeList]);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();

    const newNote: Note = await createNote(title, content);
    console.log("handleAddNote:newNote:", newNote);

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  const handleDeleteNote = async (event: React.MouseEvent, noteId: string) => {
    event.stopPropagation();
    await deleteNote(noteId);
    const updatedNotes = notes.filter((note) => note.id != noteId);
    setNotes(updatedNotes);
  };

  const handleNoteVersion = async (event: React.MouseEvent, noteId: string) => {
    event.stopPropagation();
    navigate(`/version/${noteId}`);
  };

  return (
    <Fragment>
      <div className="container app-container">
        <h3>{getUserName()}</h3>
      </div>
      <div className="container app-container">
        <form
          onSubmit={(event) =>
            selectedNote ? handleUpdateNote(event) : handleAddNote(event)
          }
          className="note-form"
        >
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            placeholder="title"
            required
          ></input>
          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            placeholder="content"
            rows={10}
            required
          ></textarea>

          {selectedNote ? (
            <div className="edit-buttons">
              <button type="submit">Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <button type="submit">Add Note</button>
          )}
        </form>
        <div className="notes-grid">
          {notes.map((note) => (
            <div
              className="note-item"
              onClick={() => handleNoteClick(note)}
              key={note.id}
            >
              <div className="notes-header">
                <button onClick={(event) => handleNoteVersion(event, note.id)}>
                  ⌛
                </button>
                <button onClick={(event) => handleDeleteNote(event, note.id)}>
                  ❌
                </button>
              </div>
              <h2>{note.title}</h2>
              <p className="multi-line-text">{note.content}</p>
              <div className="notes-footer">
                <p>Updated at {note.updatedat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default Dashboard;
