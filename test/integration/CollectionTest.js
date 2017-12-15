let assert = require('assert');
let { Pool } = require('pg');
let pool = new Pool({
	connectionString: 'postgres://localhost:5432/testerino'
});

let {
	User,
	UserCollection,
	Team,
	TeamCollection,
	GameCollection
} = require('./bootstrap');

let users = new UserCollection();

function collectTest() {
	return Promise.all([
		users.collect(),
		pool.query(`select count(*) from users`)
	])
		.then(u => {
			let count = parseInt(u[1].rows[0].count, 10);
			let collectCount = u[0].length;

			assert(count === collectCount, 'Counts did not match');
			assert(u[0].every(m => m.greet), 'Results do not appear to be users');
		})
		.then(() => {
			console.log('\tcollect succeeded');
		});
}

function findByIdTest() {
	let found;
	return pool.query(`select user_id, name from users limit 1`)
		.then(r => {
			found = {
				id: r.rows[0].user_id,
				name: r.rows[0].name
			};

			return users.findById(found.id);
		})
		.then(u => {
			assert(u.id === found.id, 'id mismatch');
			assert(u.name === found.name, 'name mismatch');
			assert(u.greet() === `Hello, ${u.name}`, 'bad greeting');
		})
		.then(() => {
			console.log('\tfindById succeeded');
		});
}

function findOneTest() {
	let found;
	return pool.query(`select user_id, name from users limit 1`)
		.then(r => {
			found = {
				id: r.rows[0].user_id,
				name: r.rows[0].name
			};

			return users.findOne();
		})
		.then(u => {
			assert(u.id === found.id, 'id mismatch');
			assert(u.name === found.name, 'name mismatch');
			assert(u.greet() === `Hello, ${u.name}`, 'bad greeting');
		})
		.then(() => {
			console.log('\tfindOne succeeded');
		});
}

module.exports = Promise.all([
	findByIdTest(),
	collectTest(),
	findOneTest()
]);
