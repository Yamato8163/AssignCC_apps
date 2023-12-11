// src/Notepad.js
import React, { useState } from 'react';
import { Button, FormControl, ListGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import emailjs from 'emailjs-com';

const colorOptions = [
  { name: 'White', code: '#ffffff' },
  { name: 'Misty Rose', code: '#ffe4e1' },
  { name: 'Light Blue', code: '#add8e6' },
  { name: 'Lavender', code: '#e6e6fa' },
  { name: 'Pale Green', code: '#98fb98' },
  // Add more color options as needed
];

const Notepad = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].code); // Default color is the first one
  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = (action, task, color) => {
    const serviceId = 'service_9k0uh7b';
    const templateId = 'template_agc9h4j';

    const templateParams = {
      action,
      taskName: task.text,
      backgroundColor: color,
    };

    emailjs.send(serviceId, templateId, templateParams, 'A5uFU8WOGTHkxxKyF').then(
      (response) => {
        console.log('Email sent:', response);
        setEmailSent(true);
      },
      (error) => {
        console.error('Error sending email:', error);
        setEmailSent(false);
      }
    );
  };

  const addNote = () => {
    if (newNote.trim() !== '') {
      const noteId = notes.length + 1;
      setNotes([...notes, { id: noteId, content: newNote, color: selectedColor }]);
      setNewNote('');
      sendEmail('Note Added', newNote, selectedColor);
    }
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    sendEmail('Note Deleted', notes.find((note) => note.id === noteId).content, selectedColor);
  };

  return (
    <div className="notepad-container" style={{ backgroundImage: 'url("your-notepad-background.jpg")', padding: '20px' }}>
      <div className="mt-3">
        <h2 className="text-center mb-4" style={{ color: '#3498db' }}>
          Notepad
        </h2>
        <FormControl
          as="textarea"
          placeholder="Add a new note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="mb-2"
          style={{ marginBottom: '10px' }}
        />
        <div className="d-flex mb-2">
          <DropdownButton
            title="Select Color"
            variant="secondary"
            onSelect={(color) => setSelectedColor(color)}
          >
            {colorOptions.map((colorOption) => (
              <Dropdown.Item
                key={colorOption.code}
                eventKey={colorOption.code}
                style={{ backgroundColor: colorOption.code }}
              >
                {colorOption.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <Button variant="primary" onClick={addNote} className="ml-2" style={{ marginLeft: '10px' }}>
            Add Note
          </Button>
        </div>
        <ListGroup className="mt-3">
          {notes.map((note) => (
            <ListGroup.Item
              key={note.id}
              className="d-flex justify-content-between align-items-center"
              style={{ backgroundColor: note.color, marginBottom: '10px', padding: '15px' }}
            >
              <div>
                <strong>{note.content}</strong>
              </div>
              <div>
                <Button variant="danger" className="ml-2" onClick={() => deleteNote(note.id)}>
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        {emailSent && <div className="mt-2 text-success">Email notification sent!</div>}
      </div>
    </div>
  );
};

export default Notepad;
