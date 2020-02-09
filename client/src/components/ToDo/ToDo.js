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
import Button from '../ui/Button';

type PropsType = {
  todo: ToDoType,
  socket: { [key: string]: any } | typeof undefined,
  cancelToDoAction: (id: string) => { [key: string]: mixed },
  undoToDoAction: (id: string) => { [key: string]: mixed },
  checkToDoAction: (id: string) => { [key: string]: mixed },
  editToDoAction: ({ id: string, text: string }) => { [key: string]: mixed },
  deleteToDoAction: (id: string) => { [key: string]: mixed }
};

const ToDo = ({
  todo,
  socket = undefined,
  cancelToDoAction = id => ({ id }),
  undoToDoAction = id => ({ id }),
  checkToDoAction = id => ({ id }),
  editToDoAction = ({ id, text }) => ({ id, text }),
  deleteToDoAction = id => ({ id })
}: PropsType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [toDoText, setToDoText] = useState(todo.text);

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
            <Button
              classes={['todo-action', 'cancel-editing']}
              iconButton
              dataTestId="cancel-editing"
              onClick={cancelEditing}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </Button>
            <button
              type="button"
              className="button icon-button todo-action submit-editing"
              data-testid="submit-editing"
              onClick={submitEditing}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
            <Button
              classes={['todo-action', 'submit-editing']}
              iconButton
              dataTestId="submit-editing"
              onClick={submitEditing}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </Button>
          </>
        ) : (
          <>
            {!todo.done && !todo.canceled ? (
              <>
                <Button
                  classes={['todo-action', 'cancel']}
                  dataTestId="cancel"
                  iconButton
                  onClick={() => cancel(todo.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
                <Button
                  classes={['todo-action', 'delete']}
                  iconButton
                  dataTestId="delete"
                  onClick={() => deleteItem(todo.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button
                  classes={['todo-action', 'edit']}
                  iconButton
                  dataTestId="set-editing"
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  classes={['todo-action', 'check']}
                  iconButton
                  dataTestId="check"
                  onClick={() => check(todo.id)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </Button>
              </>
            ) : null}
            {!todo.done && todo.canceled ? (
              <Button
                classes={['todo-action', 'undo']}
                iconButton
                dataTestId="undo"
                onClick={() => undo(todo.id)}
              >
                <FontAwesomeIcon icon={faUndo} />
              </Button>
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
