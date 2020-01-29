import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, NavLink, Link} from 'react-router-dom';
import AddToDo from './components/AddToDo';
import ToDoList from './components/ToDoList';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="container">
          <div className="heading">
            <Link to="/" className="heading-link">ToDo</Link>
          </div>
          <div className="app-actions">
            <AddToDo />
          </div>
          <div className="nav-links">
            <NavLink to="/" exact className="nav-link">To Do</NavLink>
            <NavLink to="/done" className="nav-link">Done</NavLink>
            <NavLink to="/canceled" className="nav-link">Canceled</NavLink>
            <NavLink to="/all" className="nav-link">All</NavLink>
          </div>
          <div className="content">
            <Switch>
              <Route path="/" exact>
                <ToDoList type="to-do" />
              </Route>
              <Route path="/all">
                <ToDoList type="all" />
              </Route>
              <Route path="/done">
                <ToDoList type="done" />
              </Route>
              <Route path="/canceled">
                <ToDoList type="canceled" />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
