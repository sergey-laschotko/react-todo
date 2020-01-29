import { actionTypes } from "../actionTypes";
import uuid from 'uuid';

const mockState = {};
mockState[uuid()] = {
  text: 'First Todo',
  done: false,
  canceled: false
};
mockState[uuid()] = {
  text: 'Make tea',
  done: true,
  canceled: false
};
mockState[uuid()] = {
  text: 'Nothing to do',
  done: false,
  canceled: true
};
mockState[uuid()] = {
  text: 'Write ToDo',
  done: false,
  canceled: false
};
mockState[uuid()] = {
  text: 'Sleep',
  done: false,
  canceled: false
};
mockState[uuid()] = {
  text: 'Go shopping',
  done: true,
  canceled: false
};

const todos = (state = mockState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TODO:
      if (action.payload) {
        const stateCopy = { ...state };
        stateCopy[uuid()] = action.payload;
        return stateCopy;
      } else {
        return state;
      }
    case actionTypes.CANCEL_TODO:
      if (action.payload !== undefined && state[action.payload]) {
        const stateCopy = { ...state };
        stateCopy[action.payload].canceled = true;
        return stateCopy;
      } else {
        return state;
      }
    case actionTypes.UNDO_TODO:
      if (action.payload !== undefined && state[action.payload]) {
        const stateCopy = { ...state };
        stateCopy[action.payload].canceled = false;
        return stateCopy;
      } else {
        return state;
      }
    case actionTypes.CHECK_TODO:
      if (action.payload !== undefined && state[action.payload]) {
        const stateCopy = { ...state };
        stateCopy[action.payload].done = true;
        return stateCopy;
      } else {
        return state;
      }
    case actionTypes.EDIT_TODO:
      if (action.payload && action.payload.id !== undefined && state[action.payload.id]) {
        const stateCopy = { ...state };
        stateCopy[action.payload.id].text = action.payload.text;
        return state;
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default todos;
