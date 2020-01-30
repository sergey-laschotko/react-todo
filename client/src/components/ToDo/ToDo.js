import React, { useState } from "react";
import "./ToDo.css";
import { connect } from 'react-redux';
import { cancelToDo, undoToDo, checkToDo, editToDo } from '../../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck, faTimes, faUndo, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ToDo = ({ todo, cancelToDo, undoToDo, checkToDo, editToDo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [toDoText, setToDoText] = useState(todo.text);

  const cancelEditing = () => {
    setToDoText(todo.text);
    setIsEditing(false);
  };

  const submitEditing = () => {
    editToDo(todo.id, toDoText);
    setIsEditing(false);
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
                    <button className="button icon-button todo-action cancel" onClick={() => cancelToDo(todo.id)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button className="button icon-button todo-action edit" onClick={() => setIsEditing(true)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="button icon-button todo-action check" onClick={() => checkToDo(todo.id)}>
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </React.Fragment>
                ) : null
              }
              {todo.canceled
                ? (
                  <button className="button icon-button todo-action undo" onClick={() => undoToDo(todo.id)}>
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

const mapDispatchToProps = dispatch => ({
  cancelToDo: id => dispatch(cancelToDo(id)),
  undoToDo: id => dispatch(undoToDo(id)),
  checkToDo: id => dispatch(checkToDo(id)),
  editToDo: (id, text) => dispatch(editToDo({ id, text }))
});

export default connect(null, mapDispatchToProps)(ToDo);
