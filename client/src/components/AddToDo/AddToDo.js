// @flow
import React, { useState } from 'react';
import './AddToDo.css';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { addToDo } from '../../actions';
import type { ToDoType } from '../../types';
import Button from '../ui/Button';

type PropsType = {
  socket: { [key: string]: any } | typeof undefined,
  addToDoAction: (todo: ToDoType) => { [key: string]: any } | (any => void)
};

const AddToDo = ({
  socket = undefined,
  addToDoAction = ({ id, text, done, canceled, deleted, updated }) => ({
    id,
    text,
    done,
    canceled,
    deleted,
    updated
  })
}: PropsType) => {
  const [isAdding, setIsAdding] = useState(false);
  const [todo, setToDo] = useState('');
  const inputRef = React.createRef();

  const add: () => void = () => {
    if (!isAdding) {
      setIsAdding(true);
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
    if (todo) {
      const newToDo = {
        id: uuid(),
        text: todo,
        done: false,
        canceled: false,
        deleted: false,
        updated: new Date().valueOf()
      };

      addToDoAction(newToDo);
      setToDo('');
      if (socket) {
        socket.emit('new todo', newToDo);
      }
    }
  };

  const onFormSubmit: (e: SyntheticEvent<HTMLButtonElement>) => void = e => {
    e.preventDefault();
    add();
  };

  const cancelAdding: () => void = () => {
    setIsAdding(false);
    setToDo('');
  };

  const cancelButtonClasses = isAdding
    ? ['add-todo-action', 'visible']
    : ['add-todo-action', 'hidden'];
  const submitButtonClasses = isAdding
    ? ['add-todo-action', 'success']
    : ['add-todo-action', 'success', 'fullwidth'];

  return (
    <form onSubmit={onFormSubmit}>
      <div
        className={`add-todo-input-container ${isAdding ? 'expanded' : ''}`}
        data-testid="add-todo-container"
      >
        <input
          type="text"
          placeholder="Enter new ToDo"
          data-testid="todo-input"
          className="add-todo-input"
          value={todo}
          onChange={e => setToDo(e.target.value)}
          ref={inputRef}
        />
      </div>
      <div className="add-todo-actions">
        <Button classes={cancelButtonClasses} onClick={cancelAdding} dataTestId="cancel-button">
          Cancel
        </Button>
        <Button classes={submitButtonClasses} onClick={add} dataTestId="add-button">
          {isAdding ? 'Add' : 'New ToDo'}
        </Button>
      </div>
    </form>
  );
};

const mapDispatchToProps = dispatch => ({
  addToDoAction: todo => dispatch(addToDo(todo))
});

export default connect(null, mapDispatchToProps)(AddToDo);
