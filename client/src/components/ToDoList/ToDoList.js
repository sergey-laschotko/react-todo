import React, { useState, useEffect } from 'react';
import './ToDoList.css';
import { connect } from 'react-redux';
import { changeOrder } from '../../actions';
import { withRouter } from 'react-router-dom';
import ToDo from '../ToDo';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import type { ToDoType, StateType } from '../../types';
import type { Location } from 'react-router-dom';

type ToDosType = ToDoType[];

type PropsType<T> = T & {
  location: Location,
  type: string,
  todos: ToDosType
};

const ToDoList = <T: *>({ location, type, todos, socket, ...rest }: PropsType<T>) => {
  const [currentToDos, setCurrentToDos] = useState([]);
  const { changeOrder } = rest;

  const prepareTodosList: () => void = () => {
    if (type === 'to-do') {
      setCurrentToDos(todos.filter(todo => !todo.done && !todo.canceled && !todo.canceled && !todo.deleted));
    } else if (type === 'done') {
      setCurrentToDos(todos.filter(todo => todo.done && !todo.deleted));
    } else if (type === 'canceled') {
      setCurrentToDos(todos.filter(todo => todo.canceled && !todo.deleted));
    } else {
      setCurrentToDos(todos.filter(todo => !todo.deleted));
    }
  };

  useEffect(prepareTodosList, [location, todos]);

  const onDragEnd: (any, any) => void = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    const todo1 = currentToDos[source.index];
    const todo2 = currentToDos[destination.index];
    const id1 = todo1.id;
    const id2 = todo2.id;
    const ids = todos.map(todo => todo.id);
    const id1Index = ids.indexOf(id1);
    const id2Index = ids.indexOf(id2);
    const toDosCopy = [...todos];
    changeOrder({ id1, id2 });
    const [removed] = toDosCopy.splice(id1Index, 1);
    toDosCopy.splice(id2Index, 0, removed);
    toDosCopy[id2Index].updated = new Date().valueOf();
    setCurrentToDos(toDosCopy);
    socket.emit('change order', (toDosCopy));
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
                        socket={socket}
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

const mapStateToProps = (state: StateType) => ({
  todos: state
});

const mapDispatchToProps = dispatch => ({
  changeOrder: ({ id1, id2 }) => dispatch(changeOrder({ id1, id2 }))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToDoList));