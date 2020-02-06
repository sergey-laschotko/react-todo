import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AddToDo from './AddToDo';
import { actionTypes } from '../../actionTypes';

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
  switch(action.type) {
    case actionTypes.ADD_TODO:
      return [...state, action.payload];
    default:
      return state;
  }
};

function renderWithRedux(
  ui,
  { initialState, store = createStore(reducer, initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  }
}

describe('AddToDo', () => {
  it('adds class visible to cancel button and expands input', () => {
    const { getByTestId } = render(<Provider store={createStore(reducer)}><AddToDo /></Provider>);
    const addButton = getByTestId('add-button');
    const cancelButton = getByTestId('cancel-button');
    const addTodoContainer = getByTestId('add-todo-container');
    fireEvent.click(addButton);
    expect(addTodoContainer.classList.contains('expanded')).toBeTruthy();
    expect(cancelButton.classList.contains('visible')).toBeTruthy();
  });

  it('adds todo', () => {
    const { getByTestId, store } = renderWithRedux(<AddToDo />);
    const addButton = getByTestId('add-button');
    const todoInput = getByTestId('todo-input');
    fireEvent.click(addButton);
    fireEvent.change(todoInput, { target: { value: 'Second ToDo' } });
    fireEvent.click(addButton);
    expect(todoInput.value).toBe('');
    expect(store.getState().length).toBe(2);
    expect(store.getState().map(todo => todo.text).indexOf('Second ToDo')).toBe(1);
  });
});