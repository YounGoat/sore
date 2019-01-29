'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, assert = require('assert')
	, path = require('path')
	
	/* NPM */
	, noda = require('noda')
	
	/* in-package */
	, find = noda.inRequire('find')
	;

describe('find', () => {
	let basepath = path.join(__dirname, 'resource');
	it('options.name', done => {
		let options = {
			basepath,
			name: '*.js',

		};
		find(options).then(names => {
			assert(names.length > 0);
			done();
		});
	});

	it('options.path', done => {
		let options = {
			basepath,
			path: 'js',
		};
		find(options).then(names => {
			assert(names.length > 0);
			done();
		});
	});

	it('options.type', done => {
		let options = {
			basepath,
			type: 'df',
		};
		find(options).then(names => {
			assert(names.length > 0);
			done();
		});
	});

	it('options.streamable = true', done => {
		let options = {
			basepath,
			type: 'd',
			streamable: true,
		};
		let s = find(options);
		s.on('error', done);
		s.on('close', done);
	});
});
