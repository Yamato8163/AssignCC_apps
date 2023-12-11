import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import TodoList from './TodoList';
import Notepad from './Notepad';

function App() {
  return (
    <Router>
      <div className="App">
        <Tabs defaultActiveKey="todo" id="tabs">
          <Tab eventKey="todo" title="TodoList">
            <TodoList />
          </Tab>
          <Tab eventKey="notepad" title="Notepad">
            <Notepad />
          </Tab>
        </Tabs>
      </div>
    </Router>
  );
}

export default App;
