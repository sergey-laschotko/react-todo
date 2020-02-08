// @flow
import React, { useState } from 'react';
import './ToDo.css';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faCheck,
  faTimes,
  faUndo,
  faTimesCircle,
  faCheckCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { cancelToDo, undoToDo, checkToDo, editToDo, deleteToDo } from '../../actions';
import { type ToDoType } from '../../types';

type PropsType<T> = T & {
  todo: ToDoType
};

const ToDo = <T: *>({ todo, socket, ...rest }: PropsType<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [toDoText, setToDoText] = useState(todo.text);
  const {
    cancelToDoAction,
    undoToDoAction,
    checkToDoAction,
    editToDoAction,
    deleteToDoAction
  } = rest;

  const cancelEditing: () => void = () => {
    setToDoText(todo.text);
    setIsEditing(false);
  };

  const submitEditing: () => void = () => {
    editToDoAction({ id: todo.id, text: toDoText });
    if (socket) {
      socket.emit('edit todo', { id: todo.id, text: toDoText });
    }
    setIsEditing(false);
  };

  const cancel = todoId => {
    cancelToDoAction(todoId);
    if (socket) {
      socket.emit('cancel todo', todoId);
    }
  };

  const check = todoId => {
    checkToDoAction(todoId);
    if (socket) {
      socket.emit('check todo', todoId);
    }
  };

  const undo = todoId => {
    undoToDoAction(todoId);
    if (socket) {
      socket.emit('undo todo', todoId);
    }
  };

  const deleteItem = todoId => {
    deleteToDoAction(todoId);
    if (socket) {
      socket.emit('delete todo', todoId);
    }
  };

  return (
    <div className={`todo ${todo.done ? 'done' : ''} ${todo.canceled ? 'canceled' : ''}`}>
      <div className="todo-data">
        {isEditing ? (
          <input
            className="todo-input"
            type="text"
            value={toDoText}
            data-testid="todo-edit-input"
            onChange={e => setToDoText(e.target.value)}
          />
        ) : (
          <div className={`todo-text ${todo.canceled ? 'line-through' : ''}`}>{todo.text}</div>
        )}
      </div>
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="button icon-button todo-action cancel-editing"
              data-testid="cancel-editing"
              onClick={cancelEditing}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
            <button
              type="button"
              className="button icon-button todo-action submit-editing"
              data-testid="submit-editing"
              onClick={submitEditing}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
          </>
        ) : (
          <>
            {!todo.done && !todo.canceled ? (
              <>
                <button
                  type="button"
                  className="button icon-button todo-action cancel"
                  data-testid="cancel"
                  onClick={() => cancel(todo.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <button
                  type="button"
                  className="button icon-button todo-action delete"
                  data-testid="delete"
                  onClick={() => deleteItem(todo.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                  type="button"
                  className="button icon-button todo-action edit"
                  data-testid="set-editing"
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  type="button"
                  className="button icon-button todo-action check"
                  data-testid="check"
                  onClick={() => check(todo.id)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </>
            ) : null}
            {!todo.done && todo.canceled ? (
              <button
                type="button"
                className="button icon-button todo-action undo"
                data-testid="undo"
                onClick={() => undo(todo.id)}
              >
                <FontAwesomeIcon icon={faUndo} />
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  cancelToDoAction: (id: string) => dispatch(cancelToDo(id)),
  undoToDoAction: (id: string) => dispatch(undoToDo(id)),
  checkToDoAction: (id: string) => dispatch(checkToDo(id)),
  editToDoAction: ({ id, text }: { id: string, text: string }) => dispatch(editToDo({ id, text })),
  deleteToDoAction: (id: string) => dispatch(deleteToDo(id))
});

export default connect(null, mapDispatchToProps)(ToDo);
