// @flow
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, NavLink, Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { connect } from 'react-redux';
import { setToDos } from './actions';
import AddToDo from './components/AddToDo';
import ToDoList from './components/ToDoList';

type PropsType<T> = T;

function App<T: *>({ ...rest }: PropsType<T>) {
  const { setToDosAction, todos } = rest;
  const [socketInstance, setSocketInstance] = useState();
  const setCurrentTodos = useState(todos)[1];
  const [error, setError] = useState('');

  const controlSocket = () => {
    const socket = socketIOClient(process.env.REACT_APP_WEBSOCKET);

    socket.on('connect', () => {
      setSocketInstance(socket);
    });

    socket.on('reconnect', () => {
      setCurrentTodos(tds => {
        if (socket) {
          socket.emit('current state', tds);
        }
        return tds;
      });
    });

    socket.on('current storage', storage => {
      if (!todos.length) {
        setToDosAction(storage);
      }
    });

    socket.on('todos were changed', state => setToDosAction(state));

    socket.on('error occured', data => {
      setError(data.error);
      setToDosAction(data.todos);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  };

  const updateCurrentTodos = () => {
    setCurrentTodos(todos);
  };

  const getTodosFromLS = () => {
    const state = localStorage.getItem(process.env.REACT_APP_LS_TODOS);
    if (state) {
      setToDosAction(JSON.parse(state));
    }
  };

  useEffect(getTodosFromLS, []);
  useEffect(controlSocket, []);
  useEffect(updateCurrentTodos, [todos]);
  useEffect(() => {
    let timerId;
    if (error) {
      timerId = setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  return (
    <Router>
      <div className="app">
        <div className="container">
          <div className={`error ${error ? 'shown' : ''}`}>{error}</div>
          <div className="heading">
            <Link to="/" className="heading-link">
              ToDo
            </Link>
          </div>
          <div className="app-actions">
            <AddToDo socket={socketInstance} />
          </div>
          <div className="nav-links">
            <NavLink to="/" exact className="nav-link">
              To Do
            </NavLink>
            <NavLink to="/done" className="nav-link">
              Done
            </NavLink>
            <NavLink to="/canceled" className="nav-link">
              Canceled
            </NavLink>
            <NavLink to="/all" className="nav-link">
              All
            </NavLink>
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
  setToDosAction: state => dispatch(setToDos(state))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
