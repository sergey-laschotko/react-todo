// @flow
export type ToDoType = {
  id: string,
  text: string,
  done: boolean,
  canceled: boolean,
  updated: number,
  deleted: boolean
};

export type ToDosType = ToDoType[];

export type StateType = ToDoType[];

export type EditToDoPropType = {
  id: string,
  text: string
};

export type ChangeOrderType = {
  id1: string,
  id2: string
};

export type ActionType = {
  type: string,
  payload: any
};
