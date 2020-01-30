import React, { useState, useEffect } from 'react';
import './ToDoList.css';
import { connect } from 'react-redux';
import { changeOrder } from '../../actions';
import { withRouter } from 'react-router-dom';
import ToDo from '../ToDo';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const ToDoList = ({ location, type, todos, changeOrder }) => {
  const [currentToDos, setCurrentToDos] = useState([]);

  const prepareTodosList = () => {
    if (type === 'to-do') {
      setCurrentToDos(todos.filter(todo => !todo.done && !todo.canceled && !todo.canceled));
    } else if (type === 'done') {
      setCurrentToDos(todos.filter(todo => todo.done));
    } else if (type === 'canceled') {
      setCurrentToDos(todos.filter(todo => todo.canceled));
    } else {
      setCurrentToDos(todos);
    }
  };

  useEffect(prepareTodosList, [location, todos]);

  const onDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    const todo1 = currentToDos[source.index];
    const todo2 = currentToDos[destination.index];
    const id1 = todo1.id;
    const id2 = todo2.id;
    const currentToDosCopy = [...currentToDos];
    if (type === 'all') {
      changeOrder({ id1, id2, all: true });
      const [removed] = currentToDosCopy.splice(source.index, 1);
      currentToDosCopy.splice(destination.index, 0, removed);
      setCurrentToDos(currentToDosCopy);
    } else {
      currentToDosCopy[source.index] = todo2;
      currentToDosCopy[destination.index] = todo1;
      setCurrentToDos(currentToDosCopy);
      changeOrder({ id1, id2, all: false });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided, snapshot) => {
          return (<div className="todo-list" { ...provided.droppableProps } ref={provided.innerRef}>
            {currentToDos.length
              ? currentToDos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      key={todo.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ marginBottom: '5px', ...provided.draggableProps.style}}
                    >
                      <ToDo
                        todo={todo}
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

const mapDispatchToProps = dispatch => ({
  changeOrder: ({ id1, id2, all }) => dispatch(changeOrder({ id1, id2, all }))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToDoList));