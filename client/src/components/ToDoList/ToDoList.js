// @flow
import React, { useState, useEffect } from 'react';
import './ToDoList.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ToDo from '../ToDo';
import { type StateType, type ToDosType } from '../../types';
import { setToDos } from '../../actions';

type PropsType = {
  type: string,
  todos: ToDosType,
  socket: { [key: string]: any } | typeof undefined,
  setToDosAction?: (todos: ToDosType) => void
};

const ToDoList = ({ type, todos, socket = undefined, setToDosAction = () => [] }: PropsType) => {
  const [currentToDos, setCurrentToDos] = useState([]);

  const prepareTodosList: (providedTodos?: ToDosType | typeof undefined) => void = (
    providedTodos: ToDosType | typeof undefined
  ) => {
    const todoList = providedTodos || todos;
    if (type === 'to-do') {
      setCurrentToDos(todoList.filter(todo => !todo.done && !todo.canceled && !todo.deleted));
    } else if (type === 'done') {
      setCurrentToDos(todoList.filter(todo => todo.done && !todo.deleted));
    } else if (type === 'canceled') {
      setCurrentToDos(todoList.filter(todo => todo.canceled && !todo.deleted));
    } else {
      setCurrentToDos(todoList.filter(todo => !todo.deleted));
    }
  };

  useEffect(prepareTodosList, [type, todos]);

  const onDragEnd: (any, any) => void = ({ destination, source }) => {
    if (source && destination && source.index !== destination.index) {
      const todosCopy = [...todos];
      const todo1 = currentToDos[source.index];
      const todo2 = currentToDos[destination.index];
      const todoIds = todosCopy.map(todo => todo.id);
      const todo1Index = todoIds.indexOf(todo1.id);
      const todo2Index = todoIds.indexOf(todo2.id);
      if (todo1Index >= 0 && todo2Index >= 0) {
        const [removed] = todosCopy.splice(todo1Index, 1);
        todosCopy.splice(todo2Index, 0, removed);
        todosCopy[todo2Index].updated = new Date().valueOf();
        prepareTodosList(todosCopy);
        setToDosAction(todosCopy);
        if (socket) {
          socket.emit('change order', todosCopy);
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo-list">
        {provided => {
          return (
            <div className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
              {currentToDos.length ? (
                currentToDos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {providedProps => (
                      <div
                        key={todo.id}
                        ref={providedProps.innerRef}
                        {...providedProps.draggableProps}
                        {...providedProps.dragHandleProps}
                        style={{ marginBottom: '5px', ...providedProps.draggableProps.style }}
                      >
                        <ToDo todo={todo} socket={socket} />
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="todo-list-message">No ToDos found</div>
              )}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

ToDoList.defaultProps = {
  setToDosAction: () => []
};

const mapStateToProps = (state: StateType) => ({
  todos: state
});

const mapDispatchToProps = dispatch => ({
  setToDosAction: todos => dispatch(setToDos(todos))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToDoList));
