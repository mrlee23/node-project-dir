/**
 * @fileOverview project-dir helper module
 * @name path.js
 * @author Dongsoo Lee <mrlee_23@naver.com>
 * @copyright 2018 Dongsoo Lee <mrlee_23@naver.com>
 * @module lib/path
 * @version 0.1.0
 * @since 0.0.1
 * @created 2017-12-26
 *
 * @requires module:path
 * @requires module:fs
 * @requires module:lib/typeCheck.js
 *
 */

const path = require('path'),
	  fs = require('fs'),
	  type = require('./typeCheck.js');

/**
 * @class
 * @name Path
 * @classdesc path main class
 * @version 0.1.0
 * @since 0.0.1
 * @created 2017-12-26
 */
let Path = {
	__proto__: path.__proto__
};
Object.getOwnPropertyNames(path).forEach(function (key) {
    Object.defineProperty(Path, key, Object.getOwnPropertyDescriptor(path, key));
});

Object.assign(Path, {
	/**
	 * @public
	 * @instance
	 * @function locateBase:
	 * @version 0.1.0
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:lib/path~Path
	 * @description Search base locate
	 *
	 * @param {string} _path - Starting point
	 * @param {query} regexp - If matched, will be break.
	 * @throws {Error} path does not exists.
	 * @returns {string} base path or "/"
	 */
	locateBase: function (_path, regexp) {
		if (!fs.existsSync(_path)) throw new Error(`_path(${_path}) does not exist.`);
		return this.toRoot(_path, (basedir, nodes) => {
			return nodes.some(node => node.match(regexp));
		});
	},
	/**
	 * @public
	 * @instance
	 * @function toRoot
	 * @version 0.1.0
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:lib/path~Path
	 * @description goto root if no breaks.
	 *
	 * @param {string} _path - Starting path
	 * @param {Object} options
	 * @param {Object} options.resolve=true - if true, giving path will be resolved, 
	 * @param {Object} options.reliable=false - if true, check all directory is exists.
	 * @param {Function} callback - If this callback function returns true, loop will be break.
	 * @throws {Error} Callback or path(options.reliable == true) does not exist.
	 * @returns {string} breaked path. If no breaks returns "/"
	 *
	 */
	toRoot: function (_path, ...args) {
		let callback = args.pop(),
			options = args[0] || {};
		options = Object.assign({
			resolve: true,
			reliable: false
		}, options);
		if (options.reliable && !fs.existsSync(_path)) throw new Error(`_path(${_path}) does not exist.`);
		if (typeof callback !== 'function') throw new Error(`The callback function does not set.`);
		options.resolve && (_path = path.resolve(_path));
		while (!type.isRoot(_path)) {
			if (options.reliable)
				!fs.lstatSync(_path).isDirectory() && (_path = path.dirname(_path));
			let nodes = fs.existsSync(_path) ? fs.readdirSync(_path) : [];
			if (callback(_path, nodes) == true) break; // to exit when callback returns true.
			_path = path.join(_path, '../');
		}
		return _path;
	},
	/**
	 * @public
	 * @instance
	 * @function equal
	 * @version 0.1.0
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:lib/path~Path
	 * @description Check two paths are equal.
	 *
	 * @param {string} path1 - to check path
	 * @param {string} path2 - to check path
	 * @returns {boolean} If paths are equal, returns true.
	 */
	equal: function (path1, path2) {
		return path.relative(path1, path2).length == 0;
	},
	/**
	 * @public
	 * @instance
	 * @function isParent
	 * @version 0.1.0
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:lib/path~Path
	 * @description Check path1 is parent of path2
	 *
	 * @param {string} path1 - maybe parent
	 * @param {string} path2 - maybe child
	 * @returns {boolean} If path1 is parent of path2, returns true.
	 */
	isParent: function (path1, path2) {
		let self = this;
		return type.isRoot(this.toRoot(path.dirname(path2), p => {
			return self.equal(path1, p);
		})) != true;
	}
});

module.exports = Path;
