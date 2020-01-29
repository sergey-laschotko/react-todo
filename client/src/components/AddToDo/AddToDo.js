import React, { useState } from 'react';
import './AddToDo.css';
import { connect } from 'react-redux';
import { addToDo } from '../../actions';

const AddToDo = ({ addToDo }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [todo, setToDo] = useState('');

  const add = () => {
    if (!isAdding) {
      setIsAdding(true);
    } else {
      if (todo) {
        addToDo({
          text: todo,
          done: false,
          canceled: false
        });
        setToDo('');
      }
    }
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setToDo('');
  };

  const onAddInputKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      add();
    }
  };

  return (
    <React.Fragment>
      <div className={`add-todo-input-container ${isAdding ? 'expanded' : ''}`}>
        <textarea placeholder="Enter new ToDo" className="add-todo-input" value={todo} onChange={e => setToDo(e.target.value)} onKeyDown={onAddInputKeyDown}></textarea>
      </div>
      <div className="add-todo-actions">
        <button className={`button add-todo-action ${isAdding ? 'visible' : 'hidden'}`} onClick={cancelAdding}>Cancel</button>
        <button className={`button add-todo-action success ${isAdding ? '' : 'fullwidth'}`} onClick={add}>{isAdding ? 'Add' : 'New ToDo'}</button>
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => ({
  addToDo: todo => dispatch(addToDo(todo))
});

export default connect(null, mapDispatchToProps)(AddToDo);