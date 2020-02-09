// @flow
import actionTypes from '../actionTypes';
import type { ToDoType, EditToDoPropType } from '../types';

export const addToDo = (todo: ToDoType) => ({
  type: actionTypes.ADD_TODO,
  payload: todo
});

export const setToDos = (todos: ToDoType[]) => ({
  type: actionTypes.SET_TODOS,
  payload: todos
});

export const cancelToDo = (toDoId: string) => ({
  type: actionTypes.CANCEL_TODO,
  payload: toDoId
});

export const undoToDo = (toDoId: string) => ({
  type: actionTypes.UNDO_TODO,
  payload: toDoId
});

export const checkToDo = (toDoId: string) => ({
  type: actionTypes.CHECK_TODO,
  payload: toDoId
});

export const editToDo = ({ id, text }: EditToDoPropType) => ({
  type: actionTypes.EDIT_TODO,
  payload: { id, text }
});

export const deleteToDo = (todoId: string) => ({
  type: actionTypes.DELETE_TODO,
  payload: todoId
});
