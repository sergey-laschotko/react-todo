import { actionTypes } from "../actionTypes";
import type { StateType } from '../types';

type ActionType = {
  type: String,
  payload: any
};

const todos = (state: StateType = [], action: ActionType) => {
  switch (action.type) {
    case actionTypes.ADD_TODO:
      if (action.payload) {
        const newState = [...state, action.payload];
        localStorage.setItem('todos', JSON.stringify(newState));
        return newState;
      } else {
        return state;
      }
    case actionTypes.CANCEL_TODO:
      if (action.payload !== undefined) {
        const stateCopy = [ ...state ];
        const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
        if (todoIndex >= 0) {
          stateCopy[todoIndex].canceled = true;
          stateCopy[todoIndex].updated = new Date().valueOf();
          localStorage.setItem('todos', JSON.stringify(stateCopy));
          return stateCopy;
        } else {
          return state;
        }
      } else {
        return state;
      }
    case actionTypes.UNDO_TODO:
      if (action.payload !== undefined) {
        const stateCopy = [ ...state ];
        const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
        if (todoIndex >= 0) {
          stateCopy[todoIndex].canceled = false;
          stateCopy[todoIndex].updated = new Date().valueOf();
          localStorage.setItem('todos', JSON.stringify(stateCopy));
          return stateCopy;
        } else {
          return state;
        }
      } else {
        return state;
      }
    case actionTypes.CHECK_TODO:
      if (action.payload !== undefined) {
        const stateCopy = [ ...state ];
        const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
        if (todoIndex >= 0) {
          stateCopy[todoIndex].done = true;
          stateCopy[todoIndex].updated = new Date().valueOf();
          localStorage.setItem('todos', JSON.stringify(stateCopy));
          return stateCopy;
        } else {
          return state;
        }
      } else {
        return state;
      }
    case actionTypes.EDIT_TODO:
      if (action.payload && action.payload.id !== undefined) {
        const stateCopy = [ ...state ];
        const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload.id);
        if (todoIndex >= 0) {
          stateCopy[todoIndex].text = action.payload.text;
          stateCopy[todoIndex].updated = new Date().valueOf();
          localStorage.setItem('todos', JSON.stringify(stateCopy));
          return stateCopy;
        } else {
          return state;
        }
      } else {
        return state;
      }
    case actionTypes.DELETE_TODO:
      if (action.payload !== undefined) {
        const stateCopy = [ ...state ];
        const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
        if (todoIndex >= 0) {
          stateCopy[todoIndex].deleted = true;
          stateCopy[todoIndex].updated = new Date().valueOf();
          localStorage.setItem('todos', JSON.stringify(stateCopy));
          return stateCopy;
        } else {
          return state;
        }
      } else {
        return state;
      }
    case actionTypes.CHANGE_ORDER:
      if (action.payload.id1 !== undefined && action.payload.id2 !== undefined) {
        const stateCopy = [...state];
        const todoIds = stateCopy.map(todo => todo.id);
        const todo1Index = todoIds.indexOf(action.payload.id1);
        const todo2Index = todoIds.indexOf(action.payload.id2);
        if (todo1Index >= 0 && todo2Index >= 0) {
          const [removed] = stateCopy.splice(todo1Index, 1);
          stateCopy.splice(todo2Index, 0, removed);
          stateCopy[todo2Index].updated = new Date().valueOf();
          localStorage.setItem('todos', JSON.stringify(stateCopy));
          return stateCopy;
        } else {
          return state;
        }
      } else {
        return state;
      }
    case actionTypes.SET_TODOS:
      if (action.payload) {
        localStorage.setItem('todos', JSON.stringify(action.payload));
        return action.payload;
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default todos;
