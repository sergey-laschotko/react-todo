export type ToDoType = {
  id: string,
  text: string,
  done: boolean,
  canceled: boolean,
  updated: number
};

export type StateType = ToDoType[];

export type EditToDoPropType = {
  id: string,
  text: string
};

export type ChangeOrderType = {
  id1: string,
  id2: string,
  all: boolean
};