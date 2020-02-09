// @flow
import actionTypes from '../actionTypes';
import { type ActionType, type StateType } from '../types';

const todos = (state: StateType = [], action: ActionType) => {
  switch (action.type) {
    case actionTypes.ADD_TODO: {
      const newState = [...state, action.payload];
      localStorage.setItem(process.env.REACT_APP_LS_TODOS, JSON.stringify(newState));
      return newState;
    }
    case actionTypes.CANCEL_TODO: {
      const stateCopy = [...state];
      const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
      if (todoIndex >= 0) {
        stateCopy[todoIndex].canceled = true;
        stateCopy[todoIndex].updated = new Date().valueOf();
        localStorage.setItem(process.env.REACT_APP_LS_TODOS, JSON.stringify(stateCopy));
        return stateCopy;
      }
      return state;
    }
    case actionTypes.UNDO_TODO: {
      const stateCopy = [...state];
      const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
      if (todoIndex >= 0) {
        stateCopy[todoIndex].canceled = false;
        stateCopy[todoIndex].updated = new Date().valueOf();
        localStorage.setItem(process.env.REACT_APP_LS_TODOS, JSON.stringify(stateCopy));
        return stateCopy;
      }
      return state;
    }
    case actionTypes.CHECK_TODO: {
      const stateCopy = [...state];
      const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
      if (todoIndex >= 0) {
        stateCopy[todoIndex].done = true;
        stateCopy[todoIndex].updated = new Date().valueOf();
        localStorage.setItem(process.env.REACT_APP_LS_TODOS, JSON.stringify(stateCopy));
        return stateCopy;
      }
      return state;
    }
    case actionTypes.EDIT_TODO: {
      const stateCopy = [...state];
      const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload.id);
      if (todoIndex >= 0) {
        stateCopy[todoIndex].text = action.payload.text;
        stateCopy[todoIndex].updated = new Date().valueOf();
        localStorage.setItem(process.env.REACT_APP_LS_TODOS, JSON.stringify(stateCopy));
        return stateCopy;
      }
      return state;
    }
    case actionTypes.DELETE_TODO: {
      const stateCopy = [...state];
      const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
      if (todoIndex >= 0) {
        stateCopy[todoIndex].deleted = true;
        stateCopy[todoIndex].updated = new Date().valueOf();
        localStorage.setItem(process.env.REACT_APP_LS_TODOS, JSON.stringify(stateCopy));
        return stateCopy;
      }
      return state;
    }
    case actionTypes.CHANGE_ORDER: {
      const stateCopy = [...state];
      const todoIds = stateCopy.map(todo => todo.id);
      const todo1Index = todoIds.indexOf(action.payload.id1);
      const todo2Index = todoIds.indexOf(action.payload.id2);
      if (todo1Index >= 0 && todo2Index >= 0) {
        const [removed] = stateCopy.splice(todo1Index, 1);
        stateCopy.splice(todo2Index, 0, removed);
        stateCopy[todo2Index].updated = new Date().valueOf();
        localStorage.setItem(process.env.REACT_APP_LS_TODOS, JSON.stringify(stateCopy));
        return stateCopy;
      }
      return state;
    }
    case actionTypes.SET_TODOS: {
      localStorage.setItem(process.env.REACT_APP_LS_TODOS, JSON.stringify(action.payload));
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default todos;
