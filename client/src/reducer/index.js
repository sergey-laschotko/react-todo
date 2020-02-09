// @flow
import actionTypes from '../actionTypes';
import { type ActionType, type StateType } from '../types';

const todos = (state: StateType = [], action: ActionType) => {
  switch (action.type) {
    case actionTypes.ADD_TODO: {
      return [...state, action.payload];
    }
    case actionTypes.CANCEL_TODO: {
      const stateCopy = [...state];
      const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
      if (todoIndex >= 0) {
        stateCopy[todoIndex].canceled = true;
        stateCopy[todoIndex].updated = new Date().valueOf();
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
        return stateCopy;
      }
      return state;
    }
    case actionTypes.SET_TODOS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default todos;
