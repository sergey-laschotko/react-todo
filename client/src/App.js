import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, NavLink, Link} from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { connect } from 'react-redux';
import { setToDos } from './actions';
import AddToDo from './components/AddToDo';
import ToDoList from './components/ToDoList';

type PropsType<T> = T;

function App<T: *>({ ...rest }: PropsType<T>) {
  const { setToDos, todos } = rest;
  const [socketInstance, setSocketInstance] = useState();
  const setCurrentTodos = useState(todos)[1];
  const [error, setError] = useState('');

  const controlSocket = () => {
    const socket = socketIOClient('http://localhost:5000/');
    
    socket.on('connect', () => {
      console.log('Connected to WS');
      setSocketInstance(socket);
    });

    socket.on('reconnect', () => {
      setCurrentTodos(tds => {
        socket.emit('current state', tds);
        return tds;
      });
    });

    socket.on('current storage', (storage) => {
      if (!todos.length) {
        setToDos(storage)
      }
    });

    socket.on('todos were changed', (todos) => setToDos(todos));

    socket.on('error occured', (data) => {
      setError(data.error);
      setToDos(data.todos);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }

  const updateCurrentTodos = () => {
    setCurrentTodos(todos);
  };

  const getTodosFromLS = () => {
    const todos = localStorage.getItem('todos');
    if (todos) {
      setToDos(JSON.parse(todos));
    }
  };

  useEffect(getTodosFromLS, []);
  useEffect(controlSocket, []);
  useEffect(updateCurrentTodos, [todos]);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  return (
    <Router>
      <div className="app">
        <div className="container">
          <div className={`error ${error ? 'shown' : ''}`}>{error}</div>
          <div className="heading">
            <Link to="/" className="heading-link">ToDo</Link>
          </div>
          <div className="app-actions">
            <AddToDo socket={socketInstance} />
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
                <ToDoList type="to-do" socket={socketInstance} />
              </Route>
              <Route path="/all">
                <ToDoList type="all" socket={socketInstance} />
              </Route>
              <Route path="/done">
                <ToDoList type="done" socket={socketInstance} />
              </Route>
              <Route path="/canceled">
                <ToDoList type="canceled" socket={socketInstance} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

const mapStateToProps = state => ({
  todos: state
});

const mapDispatchToProps = dispatch => ({
  setToDos: state => dispatch(setToDos(state))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);