import { actionTypes } from '../actionTypes';

export const addToDo = todo => ({
    type: actionTypes.ADD_TODO,
    payload: todo
});

export const cancelToDo = toDoId => ({
    type: actionTypes.CANCEL_TODO,
    payload: toDoId
});

export const undoToDo = toDoId => ({
    type: actionTypes.UNDO_TODO,
    payload: toDoId
});

export const checkToDo = toDoId => ({
    type: actionTypes.CHECK_TODO,
    payload: toDoId
});

export const editToDo = ({ id, text }) => ({
    type: actionTypes.EDIT_TODO,
    payload: { id, text }
});
