import { actionTypes } from "../actionTypes";
import uuid from 'uuid';

const mockState = [
  {
    id: uuid(),
    text: 'First Todo',
    done: false,
    canceled: false
  },
  {
    id: uuid(),
    text: 'Make tea',
    done: true,
    canceled: false
  },
  {
    id: uuid(),
    text: 'Nothing to do',
    done: false,
    canceled: true
  },
  {
    id: uuid(),
    text: 'Write ToDo',
    done: false,
    canceled: false
  },
  {
    id: uuid(),
    text: 'Sleep',
    done: false,
    canceled: false
  },
  {
    id: uuid(),
    text: 'Go shopping',
    done: true,
    canceled: false
  }
];

const todos = (state = mockState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TODO:
      if (action.payload) {
        return [...state, action.payload];
      } else {
        return state;
      }
    case actionTypes.CANCEL_TODO:
      if (action.payload !== undefined) {
        const stateCopy = [ ...state ];
        const todoIndex = stateCopy.map(todo => todo.id).indexOf(action.payload);
        if (todoIndex >= 0) {
          stateCopy[todoIndex].canceled = true;
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
          return state;
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
          if (action.payload.all) {
            const [removed] = stateCopy.splice(todo1Index, 1);
            stateCopy.splice(todo2Index, 0, removed);
          } else {
            console.log('changing');
            const todo1 = { ...stateCopy[todo1Index] };
            const todo2 = { ...stateCopy[todo2Index] };
            stateCopy[todo1Index] = todo2;
            stateCopy[todo2Index] = todo1;
          }
          return stateCopy;
        } else {
          return state;
        }
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default todos;
