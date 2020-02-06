import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ToDoList from './ToDoList';
import { actionTypes } from '../../actionTypes';

const initialState = [
  {
    id: '123',
    text: 'First ToDo',
    updated: new Date().valueOf(),
    deleted: false,
    canceled: false,
    done: false
  },
  {
    id: '223',
    text: 'Second ToDo',
    updated: new Date().valueOf(),
    deleted: false,
    canceled: false,
    done: false
  },
  {
    id: '323',
    text: 'Third ToDo',
    updated: new Date().valueOf(),
    deleted: false,
    canceled: false,
    done: false
  }
];

const reducer = (state = initialState, action) => {
  switch(action.type) {
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

describe('ToDoList', () => {
  it('renders todo list (all todos if type equals "all"', () => {
    const { getByText } = renderWithRedux(<Router><ToDoList type="all" /></Router>);
    expect(getByText('First ToDo')).toBeTruthy();
    expect(getByText('Second ToDo')).toBeTruthy();
    expect(getByText('Third ToDo')).toBeTruthy();
  });

  it('renders only not done and not canceled if type equals "to-do"', () => {
    const currentState = [
      {
        id: '123',
        text: 'First ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: false,
        done: false
      },
      {
        id: '223',
        text: 'Second ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: false,
        done: false
      },
      {
        id: '323',
        text: 'Third ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: true,
        done: false
      }
    ];
    const { getByText } = renderWithRedux(<Router><ToDoList type="to-do" /></Router>, { currentState, store: createStore(reducer, currentState) });
    expect(document.getElementsByClassName('todo').length).toBe(2);
  });

  it('renders only canceled todos if type equals "canceled"', () => {
    const currentState = [
      {
        id: '123',
        text: 'First ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: false,
        done: false
      },
      {
        id: '223',
        text: 'Second ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: false,
        done: false
      },
      {
        id: '323',
        text: 'Third ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: true,
        done: false
      }
    ];
    const { getByText } = renderWithRedux(<Router><ToDoList type="canceled" /></Router>, { currentState, store: createStore(reducer, currentState) });
    expect(document.getElementsByClassName('todo').length).toBe(1);
  });

  it('renders only done todos if type equals "done"', () => {
    const currentState = [
      {
        id: '123',
        text: 'First ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: false,
        done: false
      },
      {
        id: '223',
        text: 'Second ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: false,
        done: true
      },
      {
        id: '323',
        text: 'Third ToDo',
        updated: new Date().valueOf(),
        deleted: false,
        canceled: false,
        done: true
      }
    ];
    const { getByText } = renderWithRedux(<Router><ToDoList type="done" /></Router>, { currentState, store: createStore(reducer, currentState) });
    expect(document.getElementsByClassName('todo').length).toBe(2);
  });
});