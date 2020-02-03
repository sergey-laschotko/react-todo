import React, { useState } from "react";
import "./ToDo.css";
import { connect } from 'react-redux';
import { cancelToDo, undoToDo, checkToDo, editToDo, deleteToDo } from '../../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck, faTimes, faUndo, faTimesCircle, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { type ToDoType } from '../../types';

type PropsType<T> = T & {
  todo: ToDoType
};

const ToDo = <T: *>({ todo, socket, ...rest }: PropsType<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [toDoText, setToDoText] = useState(todo.text);
  const { cancelToDo, undoToDo, checkToDo, editToDo, deleteToDo } = rest;

  const cancelEditing: () => void = () => {
    setToDoText(todo.text);
    setIsEditing(false);
  };

  const submitEditing: () => void  = () => {
    editToDo({ id: todo.id, text: toDoText });
    if (socket) {
      socket.emit('edit todo', { id: todo.id, text: toDoText });
    }
    setIsEditing(false);
  };

  const cancel = todoId => {
    cancelToDo(todoId);
    if (socket) {
      socket.emit('cancel todo', todoId);
    }
  };

  const check = todoId => {
    checkToDo(todoId);
    if (socket) {
      socket.emit('check todo', todoId);
    }
  };

  const undo = todoId => {
    undoToDo(todoId);
    if (socket) {
      socket.emit('undo todo', todoId);
    }
  };

  const deleteItem = todoId => {
    deleteToDo(todoId);
    if (socket) {
      socket.emit('delete todo', todoId);
    }
  };

  return (
    <div className={`todo ${todo.done ? 'done' : ''} ${todo.canceled ? 'canceled' : ''}`}>
      <div className="todo-data">
        {isEditing
          ? <input className="todo-input" type="text" value={toDoText} onChange={e => setToDoText(e.target.value)} />
          : <div className={`todo-text ${todo.canceled ? 'line-through' : ''}`}>{todo.text}</div>        
        }
      </div>
      <div className="todo-actions">
        {isEditing
          ? (
            <React.Fragment>
              <button className="button icon-button todo-action cancel-editing" onClick={cancelEditing}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
              <button className="button icon-button todo-action submit-editing" onClick={submitEditing}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!todo.done && !todo.canceled
                ? (
                  <React.Fragment>
                    <button className="button icon-button todo-action cancel" onClick={() => cancel(todo.id)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button className="button icon-button todo-action delete" onClick={() => deleteItem(todo.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="button icon-button todo-action edit" onClick={() => setIsEditing(true)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="button icon-button todo-action check" onClick={() => check(todo.id)}>
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </React.Fragment>
                ) : null
              }
              {!todo.done && todo.canceled
                ? (
                  <button className="button icon-button todo-action undo" onClick={() => undo(todo.id)}>
                    <FontAwesomeIcon icon={faUndo} />
                  </button>
                ) : null
              }
            </React.Fragment>
          )
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  cancelToDo: (id: string) => dispatch(cancelToDo(id)),
  undoToDo: (id: string) => dispatch(undoToDo(id)),
  checkToDo: (id: string) => dispatch(checkToDo(id)),
  editToDo: ({ id, text }: { id: string, text: string }) => dispatch(editToDo({ id, text })),
  deleteToDo: (id: string) => dispatch(deleteToDo(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ToDo);
