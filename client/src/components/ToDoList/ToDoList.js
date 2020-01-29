import React, { useState, useEffect } from 'react';
import './ToDoList.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ToDo from '../ToDo';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const ToDoList = ({ location, type, todos }) => {
  const [currentToDos, setCurrentToDos] = useState([]);

  const prepareTodosList = () => {
    const keys = Object.keys(todos);
    if (type === 'to-do') {
      setCurrentToDos(keys.filter(id => !todos[id].done && !todos[id].canceled && !todos[id].canceled));
    } else if (type === 'done') {
      setCurrentToDos(keys.filter(id => todos[id].done));
    } else if (type === 'canceled') {
      setCurrentToDos(keys.filter(id => todos[id].canceled));
    } else {
      setCurrentToDos(keys);
    }
  };

  useEffect(prepareTodosList, [location, todos]);

  const onDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    console.log(destination);
    console.log(source);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided, snapshot) => {
          return (<div className="todo-list" { ...provided.droppableProps } ref={provided.innerRef}>
            {currentToDos.length
              ? currentToDos.map((id, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <div key={id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ marginBottom: '5px', ...provided.draggableProps.style}}>
                      <ToDo
                        todo={todos[id]}
                        toDoId={id}
                      />
                    </div>
                  )}
                </Draggable>
              )) : <div className="todo-list-message">No ToDos found</div>
            }
            {provided.placeholder}
          </div>)
        }}
      </Droppable>
    </DragDropContext>
  );
};

const mapStateToProps = state => ({
  todos: state
});

export default connect(mapStateToProps)(withRouter(ToDoList));