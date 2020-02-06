import React from 'react';
import { render } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';

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
  return state;
};

describe('App', () => {
  it('renders title "ToDo"', () => {
    const { getByText } = render(<Provider store={createStore(reducer)}><App /></Provider>);
    expect(getByText('ToDo')).toBeInTheDocument();
  });

  it('renders links', () => {
    const { getByText } = render(<Provider store={createStore(reducer)}><App /></Provider>);
    expect(getByText('To Do')).toBeInTheDocument();
    expect(getByText('Done')).toBeInTheDocument();
    expect(getByText('Canceled')).toBeInTheDocument();
    expect(getByText('All')).toBeInTheDocument();
  });

  it('renders New ToDo button', () => {
    const { getByText } = render(<Provider store={createStore(reducer)}><App /></Provider>);
    expect(getByText('New ToDo')).toBeInTheDocument();
  });

  it('renders ToDo list', () => {
    const { getByText } = render(<Provider store={createStore(reducer)}><App /></Provider>);
    expect(getByText('First ToDo')).toBeInTheDocument();
  });
});