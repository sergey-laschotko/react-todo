const fs = require('fs');

const storage = {
	readyState: 0,
	data: []
};

if (fs.existsSync('storage.json')) {
	storage.data = JSON.parse(fs.readFileSync('storage.json'), 'utf-8');
} else {
	storage.data = {
		todos: []
	};
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
				fs.writeFileSync('storage.json', JSON.stringify(storage.data));
				storage.readyState = 1;
				console.log('Storage is ready');
			} catch (e) {
				console.log('Could not create storage');
			}
		}
	},
};