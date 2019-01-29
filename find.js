/**
 * @see man 1 find
 * 
 * Read Me!
 * . file means file, or exactly a node in the file system.
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	, path = require('path')
	, stream = require('stream')
	
	/* NPM */
	, noda = require('noda')
	, options2 = require('options2')
	, undertake = require('undertake')
	
	/* in-package */
	, pattern2regexp = noda.inRequire('lib/pattern2regexp')

	/* in-file */
	, nona = name => `no-${name}`

	, statFile = function*(file) {
		if (!file.stat) {
			file.stat = yield callback => fs.stat(file.fullname, callback);
		}
		return file.stat;
	}
	;

const TYPES = {
	d: 'Directory',
	f: 'File',
	l: 'SymbolicLink',
};

const MATCHERS = {
	/**
	 * i means case insensitive.
	 */

	iname: function(re, file) {
		return re.test(file.name.toLowerCase());
	},

	ipath: function(re, file) {
		return re.test(file.relaname.toLowerCase());
	},

	/**
	 * True if the file's basename matches the pattern.
	 */
	name: function(re, file) {
		return re.test(file.name);
	},

	/**
	 * True if the file's fullname matches the pattern.
	 */
	path: function(re, file) {
		return re.test(file.relaname);
	},

	/**
	 * True if the file is of specified type(s).
	 *   f = regular file
	 *   d = directory
	 */
	type: function*(type, file) {
		if (type == '*') return true;
		let stat = yield statFile(file);
		for (let i = 0; i < type.length; i++) {
			let typechar = type[i];
			let typename = TYPES[typechar];
			if (stat[`is${typename}`]()) {
				return true;
			}
		}
		return false;
	},

};

const MATCHER_NAMES = Object.keys(MATCHERS);

/**
 * @param {Object}    options
 * @param {boolean}   options.streamable        - Return a stream.
 * @param {string}    options.basepath
 * 
 * @param {boolean}  [options.ignore-hidden]
 * @param {string}   [options.type='df']        - Type of items.
 
 * @param {string}   [options.iname]
 * @param {string}   [options.ipath]
 * @param {string}   [options.name]
 * @param {string}   [options.pname]
 * 
 * @param {string}   [options.no-iname]
 * @param {string}   [options.no-ipath]
 * @param {string}   [options.no-name]
 * @param {string}   [options.no-pname]
 * 
 * @param {boolean}  [options.absolute=false]   - Whether to return absolute (full) pathname.
 * @param {number}   [options.depth=0]          - Max depth of sub-directories.
 *                                                0 means go through to tree ends.
 * @param {Function} [callback]                 - ATTENTION: This is an invisible param which is created by undertake.async().
 */
function find(options, callback) {
	// ---------------------------
	// Params.

	if (typeof options == 'string') {
		options = { basepath: options };
	}

	let columns = [
		'streamable DEFAULT(false)',
			
		'basepath REQUIRED',
		'absolute DEFAULT(false)',
		'depth DEFAULT(0)',
		'ignore-hidden DEFAULT(false)',
		
		'iname',
		'ipath ALIAS(iwholename)',
		'name',
		'path ALIAS(wholename)',
		'type',


		'no-iname',
		'no-ipath ALIAS(no-iwholename)',
		'no-name',
		'no-path ALIAS(no-wholename)',
		'no-type',
	];

	options = options2(options, {
		caseSensitive : false,
		keepNameCase  : false,
		explicit      : true,
		columns,
	});

	[ 'iname', 'ipath', 'name', 'path' ].forEach(name => {
		if (typeof options[name] == 'string') {
			options[name] = pattern2regexp(options[name]);
		}
		if (typeof options[nona(name)] == 'string') {
			options[nona(name)] = pattern2regexp(options[nona(name)]);
		}
	});

	let nameStream;
	let nameArray;
	let nameCount = 0;
	if (options.streamable) {
		nameStream = new stream.Readable({
			objectMode: true,
			read: function() {
				// DO NOTHING.`
			},
		});
	}
	else {
		nameArray = [];
	}

	// ---------------------------
	// Main.

	let main = function*() { 
		const { basepath } = options;
		INIT: {
			let stat = yield callback => fs.stat(basepath, callback);
			if (!stat.isDirectory()) {
				throw new Error(`pathname should refer to a directory: ${basepath}`);
			}
		}

		const dirs = [ { fullname: basepath, depth: 1 } ];
		do {
			let dir = dirs.shift();

			let goon = options.depth == 0 || dir.depth < options.depth;
			let depth = dir.depth + 1;

			let names = yield callback => fs.readdir(dir.fullname, callback);
			for (let i = 0; i < names.length; i++) {
				let name = names[i];
				let fullname = path.join(dir.fullname, name);
				let relaname = path.relative(basepath, fullname);
				let file = { name, fullname, relaname, stat: null };

				// Only items matching all conditions will be reserved.
				// So, variable `matched` is assumed `true` at first.
				let matched = true;
				
				for (let i = 0; matched && i < MATCHER_NAMES.length; i++) {
					let name = MATCHER_NAMES[i];
					let fn = MATCHERS[name];

					// Try options.<NAME>
					if (matched && options.hasOwnProperty(name)) {
						matched = yield fn(options[name], file);
					}
									
					// Try options.no-<NAME>
					if (matched && options.hasOwnProperty(nona(name))) {
						matched = !(yield fn(options[nona(name)], file));
					}
				}
				
				if (matched) {
					let name = options.absolute ? file.fullname : file.relaname;
					if (options.streamable) {
						nameStream.push(name);
						nameCount++;
					}
					else {
						nameArray.push(name);
					}
				}
				
				if (goon) {
					let stat = yield statFile(file);
					if (stat.isDirectory()) {
						dirs.push({ fullname: file.fullname, depth });
					}
				}
			}
		} while(dirs.length > 0);

		if (options.streamable) {
			nameStream.emit('close');
			return nameCount;
		}
		else {
			return nameArray;
		}
	};

	let p = undertake(main, callback, true);
	return options.streamable ? nameStream : p;
}

module.exports = find;