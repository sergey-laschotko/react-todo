import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ToDo from './ToDo';
import actionTypes from '../../actionTypes';

const initialState = [
  {
    id: '123',
    text: 'First ToDo',
    updated: new Date().valueOf(),
    deleted: false,
    canceled: false,
    done: false
  }
];

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

function renderWithRedux(ui, { store = createStore(reducer, initialState) } = {}) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
}

describe('ToDo', () => {
  it('renders todo', () => {
    const { getByText } = renderWithRedux(<ToDo todo={initialState[0]} />);
    expect(getByText('First ToDo')).toBeTruthy();
  });

  it('cancels todo', () => {
    const { getByTestId, store } = renderWithRedux(<ToDo todo={initialState[0]} />);
    const cancelButton = getByTestId('cancel');
    fireEvent.click(cancelButton);
    expect(store.getState()[0].canceled).toBeTruthy();
  });

  it('undos todo', () => {
    const { getByTestId, store } = renderWithRedux(<ToDo todo={initialState[0]} />);
    const undoButton = getByTestId('undo');
    fireEvent.click(undoButton);
    expect(store.getState()[0].canceled).not.toBeTruthy();
  });

  it('todo can be edited', () => {
    const { getByTestId, store } = renderWithRedux(<ToDo todo={initialState[0]} />);
    const setEditingButton = getByTestId('set-editing');
    fireEvent.click(setEditingButton);
    expect(getByTestId('todo-edit-input')).toBeTruthy();
    const cancelEditingButton = getByTestId('cancel-editing');
    fireEvent.click(cancelEditingButton);
    expect(document.querySelector('[data-testid=todo-edit-input]')).toBeFalsy();
    fireEvent.click(getByTestId('set-editing'));
    const todoEditInput = getByTestId('todo-edit-input');
    const newValue = 'First ToDo!';
    fireEvent.change(todoEditInput, { target: { value: newValue } });
    const submitEditingButton = getByTestId('submit-editing');
    fireEvent.click(submitEditingButton);
    expect(store.getState()[0].text).toBe(newValue);
  });

  it('checks todo', () => {
    const { getByTestId, store } = renderWithRedux(<ToDo todo={initialState[0]} />);
    const checkButton = getByTestId('check');
    fireEvent.click(checkButton);
    expect(store.getState()[0].done).toBeTruthy();
  });

  it('checks todo', () => {
    const { getByTestId, store } = renderWithRedux(
      <ToDo todo={{ ...initialState[0], done: false }} />
    );
    const deleteButton = getByTestId('delete');
    fireEvent.click(deleteButton);
    expect(store.getState()[0].deleted).toBeTruthy();
  });
});
