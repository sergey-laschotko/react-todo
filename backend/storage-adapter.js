const fs = require('fs');

const storage = {
	readyState: 0,
	todos: []
};

if (fs.existsSync('storage.json')) {
	storage.todos = JSON.parse(fs.readFileSync('storage.json'), 'utf-8');
} else {
	storage.todos = [];
}

module.exports = {
	isReady: () => {
		return storage.readyState;
	},
	connect: () => {
		if (fs.existsSync('storage.json')) {
			storage.readyState = 1;
			console.log('Storage is ready');
		} else {
			try {
				fs.writeFileSync('storage.json', JSON.stringify(storage.todos));
				storage.readyState = 1;
				console.log('Storage is ready');
			} catch (e) {
				console.log('Could not create storage');
			}
		}
	},
	getStorage: () => {
		return storage.todos;
	},
	addToDo: todo => {
		try {
			const todos = [...storage.todos];
			todos.push(todo);
			fs.writeFileSync('storage.json', JSON.stringify(todos));
			storage.todos = todos;
			return todos;
		} catch (e) {
			console.log(`Couldn't add todo because ${e.message}`);
			return { error: `Couldn't add todo`, todos: storage.todos };
		}
	},
	cancelToDo: todoId => {
		try {
			const todos = [...storage.todos];
			const todoIndex = todos.map(todo => todo.id).indexOf(todoId);
			todos[todoIndex].canceled = true;
			todos[todoIndex].updated = new Date().valueOf();
			fs.writeFileSync('storage.json', JSON.stringify(todos));
			storage.todos = todos;
			return todos;
		} catch (e) {
			console.log(`Couldn't cancel todo because ${e.message}`);
			return { error: `Couldn't cancel todo`, todos: storage.todos };
		}
	},
	undoToDo: todoId => {
		try {
			const todos = [...storage.todos];
			const todoIndex = todos.map(todo => todo.id).indexOf(todoId);
			todos[todoIndex].canceled = false;
			todos[todoIndex].updated = new Date().valueOf();
			fs.writeFileSync('storage.json', JSON.stringify(todos));
			storage.todos = todos;
			return todos;
		} catch (e) {
			console.log(`Couldn't undo todo because ${e.message}`);
			return { error: `Couldn't undo todo`, todos: storage.todos };
		}
	},
	checkToDo: todoId => {
		try {
			const todos = [...storage.todos];
			const todoIndex = todos.map(todo => todo.id).indexOf(todoId);
			todos[todoIndex].done = true;
			todos[todoIndex].canceled = false;
			todos[todoIndex].updated = new Date().valueOf();
			fs.writeFileSync('storage.json', JSON.stringify(todos));
			storage.todos = todos;
			return todos;
		} catch (e) {
			console.log(`Couldn't check todo because ${e.message}`);
			return { error: `Couldn't check todo`, todos: storage.todos };
		}
	},
	deleteToDo: todoId => {
		try {
			const todos = [...storage.todos];
			const todoIndex = todos.map(todo => todo.id).indexOf(todoId);
			todos[todoIndex].deleted = true;
			todos[todoIndex].updated = new Date().valueOf();
			fs.writeFileSync('storage.json', JSON.stringify(todos));
			storage.todos = todos;
			return todos;
		} catch (e) {
			console.log(`Couldn't delete todo because ${e.message}`);
			return { error: `Couldn't delete todo`, todos: storage.todos };
		}
	},
	editToDo: (toDoId, text) => {
		try {
			const todos = [...storage.todos];
			const todoIndex = todos.map(todo => todo.id).indexOf(toDoId);
			todos[todoIndex].text = text;
			todos[todoIndex].updated = new Date().valueOf();
			fs.writeFileSync('storage.json', JSON.stringify(todos));
			storage.todos = todos;
			return todos;
		} catch (e) {
			console.log(`Couldn't edit todo because ${e.message}`);
			return { error: `Couldn't edit todo`, todos: storage.todos };
		}
	},
	changeOrder: todos => {
		try {
			fs.writeFileSync('storage.json', JSON.stringify(todos));
			storage.todos = todos;
			return todos;
		} catch (e) {
			console.log(`Couldn't change order of todos because ${e.message}`);
			return { error: `Couldn't change order`, todos: storage.todos };
		}
	},
	mergeTodos: todos => {
		try {
			const todosCopy = [...storage.todos];
			const newTodos = [];
			if (todos.length > todosCopy.length) {
				todos.map(todo => {
					const currentToDoId = todosCopy.map(t => t.id).indexOf(todo.id);
					if (currentToDoId < 0) {
						newTodos.push(todo);
						return todo;
					} else {
						const todosCopyItem = todosCopy[currentToDoId];
						const newToDo = {
							id: todo.id,
							text: todo.updated > todosCopyItem.updated ? todo.text : todosCopyItem.text,
							done: todo.done || todosCopyItem.done ? true : false,
							canceled: todo.done || todosCopyItem.done ? false : todo.updated > todosCopyItem.updated ? todo.canceled : todosCopyItem.canceled,
							updated: todo.updated > todosCopyItem.updated ? todo.updated : todosCopyItem.updated
						};
						newTodos.push(newToDo);
						return todo;
					}
				});
			} else {
				todosCopy.map(todo => {
					const currentToDoId = todos.map(t => t.id).indexOf(todo.id);
					if (currentToDoId < 0) {
						newTodos.push(todo);
						return todo;
					} else {
						const todosCopyItem = todos[currentToDoId];
						const newToDo = {
							id: todo.id,
							text: todo.updated > todosCopyItem.updated ? todo.text : todosCopyItem.text,
							done: todo.done || todosCopyItem.done ? true : false,
							canceled: todo.done || todosCopyItem.done ? false : todo.updated > todosCopyItem.updated ? todo.canceled : todosCopyItem.canceled,
							updated: todo.updated > todosCopyItem.updated ? todo.updated : todosCopyItem.updated
						};
						newTodos.push(newToDo);
						return todo;
					}
				});
			}
			fs.writeFileSync('storage.json', JSON.stringify(newTodos));
			storage.todos = newTodos;
			return newTodos;
		} catch (e) {
			console.log(`Couldn't merge todos because ${e.message}`);
			return { error: `Couldn't update todos`, todos: storage.todos };
		}
	}
};