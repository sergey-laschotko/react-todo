import React, { useState } from 'react';
import './AddToDo.css';
import { connect } from 'react-redux';
import { addToDo } from '../../actions';
import uuid from 'uuid';

type PropsType<T> = T;

const AddToDo = <T: *>({ socket, ...props }: PropsType<T>) => {
  const [isAdding, setIsAdding] = useState(false);
  const [todo, setToDo] = useState('');
  const { addToDo } = props;
  
  const add: () => void = () => {
    if (!isAdding) {
      setIsAdding(true);
    } else {
      if (todo) {
        const newToDo = {
          id: uuid(),
          text: todo,
          done: false,
          canceled: false,
          deleted: false,
          updated: new Date().valueOf()
        };

        addToDo(newToDo);
        if (socket) {
          socket.emit('new todo', newToDo)
        }
        setToDo('');
      }
    }
  };

  const cancelAdding: () => void = () => {
    setIsAdding(false);
    setToDo('');
  };

  const onAddInputKeyDown: (event: SyntheticKeyboardEvent<HTMLButtonElement>) => void = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      add();
    }
  };

  return (
    <React.Fragment>
      <div className={`add-todo-input-container ${isAdding ? 'expanded' : ''}`} data-testid="add-todo-container">
        <textarea placeholder="Enter new ToDo" data-testid="todo-input" className="add-todo-input" value={todo} onChange={e => setToDo(e.target.value)} onKeyDown={onAddInputKeyDown}></textarea>
      </div>
      <div className="add-todo-actions">
        <button className={`button add-todo-action ${isAdding ? 'visible' : 'hidden'}`} onClick={cancelAdding} data-testid="cancel-button">Cancel</button>
        <button className={`button add-todo-action success ${isAdding ? '' : 'fullwidth'}`} onClick={add} data-testid="add-button">{isAdding ? 'Add' : 'New ToDo'}</button>
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => ({
  addToDo: todo => dispatch(addToDo(todo))
});

export default connect(null, mapDispatchToProps)(AddToDo);