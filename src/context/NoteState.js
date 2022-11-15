import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial);

  //   get a note
  const getNotes = async () => {
    const host = window.location.protocol + "//" + window.location.hostname+":5000";
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":"",
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json)
  };
  //   Add a note
  const addNote = async (title, description, tag) => {
    // Todo api call
    const host = window.location.protocol + "//" + window.location.hostname+":5000";
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = response.json()
    // setNotes(notes.push(note)); Here push updates the array result in rerender while concat return a array
    setNotes(notes.concat(json));
  };

  // Delete a note
  const deleteNote = async (id) => {
    // TODO Api Call
    const host = window.location.protocol + "//" + window.location.hostname +":5000";
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "",
      },
    });
    const json = response.json()
    console.log(json)

    console.log("Delete", id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    const host = window.location.protocol + "//" + window.location.host;
    console.log(host);
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    // const json = response.json();

    let newNotes= JSON.parse(JSON.stringify(notes))
    // Logic to edit notes in client
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break
      }
    }
    setNotes(newNotes)
  };

  return (
    <NoteContext.Provider
      value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
