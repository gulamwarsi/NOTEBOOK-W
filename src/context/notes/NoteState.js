import React, { useState } from "react";
import NoteContext from "./noteContext";


const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
    
  const [notes, setNotes] = useState(notesInitial);
  //get all note
  const getNotes = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      
        },
    });
    const json = await response.json();
   console.log(json)

    setNotes(json);
  };

  //Add Note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addNote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note=await response.json()
    setNotes(notes.concat(note));
   

   

  
  };

  //Delete Note

  const deleteNote = async (id) => {
    //Api call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":
          localStorage.getItem('token'),
      },
    });
    const json = response.json();
    console.log(json)
 
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };
  //Edit Note
  const editNote = async (id, title, description, tag) => {
    //Api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
   console.log(json)

    let newNotes=JSON.parse(JSON.stringify(notes))
    //Logic to Edit in Client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes)
  };
  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;