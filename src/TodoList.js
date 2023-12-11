// src/TodoList.js
import React, { useState, useEffect } from 'react';
import { Button, FormControl, InputGroup, ListGroup, Badge, DropdownButton, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import emailjs from 'emailjs-com';

const colorOptions = [
  { name: 'White', code: '#ffffff' },
  { name: 'Misty Rose', code: '#ffe4e1' },
  { name: 'Light Blue', code: '#add8e6' },
  { name: 'Lavender', code: '#e6e6fa' },
  { name: 'Pale Green', code: '#98fb98' },
  // Add more color options as needed
];

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState(''); // Change to empty string for initial state
  const [taskIcons, setTaskIcons] = useState({});
  const [selectedColor, setSelectedColor] = useState('#ffffff'); // Default color is white
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (emailSent) {
      // Reset emailSent state after 3 seconds
      const timeout = setTimeout(() => setEmailSent(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [emailSent]);

  const sendEmail = (action, task, color) => {
    const serviceId = 'service_9k0uh7b';
    const templateId = 'template_agc9h4j';

    const templateParams = {
      action,
      taskName: task.text,
      taskTitle,
      dueDate,
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

  const addTask = () => {
    if (newTask.trim() !== '' && taskTitle.trim() !== '' && dueDate !== '') {
      const taskId = tasks.length + 1;
      setTasks([...tasks, { id: taskId, text: newTask, taskTitle, dueDate, completed: false, color: selectedColor }]);
      setTaskIcons({ ...taskIcons, [taskId]: 'inprogress' });
      setNewTask('');
      setTaskTitle('');
      setDueDate(''); // Reset dueDate after adding a task
      sendEmail('Task Added', { text: newTask, taskTitle, dueDate }, selectedColor);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setTaskIcons((prevIcons) => {
      const newIcons = { ...prevIcons };
      delete newIcons[taskId];
      return newIcons;
    });
    sendEmail('Task Deleted', tasks.find((task) => task.id === taskId), selectedColor);
  };

  const toggleCompleted = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    setTaskIcons((prevIcons) => {
      const currentIcon = prevIcons[taskId] === 'inprogress' ? 'completed' : 'inprogress';
      return { ...prevIcons, [taskId]: currentIcon };
    });

    sendEmail(
      taskIcons[taskId] === 'inprogress' ? 'Task Completed' : 'Task Undone',
      tasks.find((task) => task.id === taskId),
      selectedColor
    );
  };

  return (
    <div className="todo-list-container" style={{ backgroundImage: 'url("your-todo-list-background.jpg")', padding: '20px' }}>
      <div className="mt-3">
        <h2 className="text-center mb-4" style={{ color: '#3498db' }}>
          TodoList
        </h2>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Task Description"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <FormControl
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-control"
          />
          <Button variant="primary" onClick={addTask} className="ml-2">
            Add Task
          </Button>
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
        </InputGroup>
        <ListGroup>
          {tasks.map((task) => (
            <ListGroup.Item
              key={task.id}
              className={`d-flex justify-content-between align-items-center ${
                task.completed ? 'completed-task' : ''
              }`}
              style={{ backgroundColor: task.color, marginBottom: '10px', padding: '15px' }}
            >
              <div>
                {taskIcons[task.id] === 'inprogress' && (
                  <FontAwesomeIcon icon={faSpinner} className="mr-2" />
                )}
                {taskIcons[task.id] === 'completed' && (
                  <FontAwesomeIcon icon={faCheck} className="mr-2 text-success" />
                )}
                <strong>{task.text}</strong>
                <Badge variant="secondary" className="ml-2">
                  {task.taskTitle}
                </Badge>
                <Badge variant="info" className="ml-2">
                  Due: {task.dueDate}
                </Badge>
              </div>
              <div>
                <Button variant="danger" className="ml-2" onClick={() => deleteTask(task.id)}>
                  Delete
                </Button>
                <Button
                  variant={task.completed ? 'warning' : 'success'}
                  className="ml-2"
                  onClick={() => toggleCompleted(task.id)}
                >
                  {task.completed ? 'Undo' : 'Complete'}
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

export default TodoList;
