/**
 * @fileOverview Manipulate project directories and files.
 * @name index.js
 * @author Dongsoo Lee <mrlee_23@naver.com>
 * @copyright 2017 Dongsoo Lee <mrlee_23@naver.com>
 * @module index
 * @version 0.0.4
 * @since 0.0.1
 * @created 2017-12-26
 *
 * @requires module:./lib/typeCheck.js
 * @requires module:./lib/path.js
 */
/**
 * For matching file name.
 * @typedef {string|RegExp|Array} Query
 */
/**
 * Represent file system path, include relative and absolute paths.
 * @typedef {string} Path
 */
/**
 * Absolute path of real file system.
 * @typedef {string} AbsPath
 */
/**
 * Represent managed path in project, include relative and absolute paths.
 * @typedef {string} ProjectPath
 */
/**
 * Represent managed absolute path in project.
 * @typedef {string} ProjectAbsPath
 */

const type = require('./lib/typeCheck.js'),
	  path = require('./lib/path.js');

/**
 * @class
 * @name ProjectDir
 * @classdesc project-dir main class
 * @version 0.0.4
 * @since 0.0.1
 * @created 2017-12-26
 */
class ProjectDir {
	/**
	 * @public
	 * @instance
	 * @function constructor
	 * @version 0.0.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Generating new project directory object.
	 *
	 * @param {Path} currentPath - Starting point for search base directory. This path must be an existing file or directory.
	 * @param {Query} basename - Dominating file or directory names.
	 *
	 * @example
	 * .constructor('./', 'node_modules')
	 */
	constructor(currentPath, basename) {
		(basename == null) && (this.basename = [".git", "package.json"]);
		this.basename = basename;
		this.basedir = currentPath;
	}

	/**
	 * @public
	 * @instance
	 * @function setbasename
	 * @version 0.0.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Set dominating file or directory names.
	 *
	 * @param {Query} basename - Dominating file or directory names.
	 * @throws {Error} Not a Query type.
	 *
	 * @example
	 * .setbasename(['.git', 'package.json'])
	 */
	set basename (basename) {
		if (!type.isQuery(basename)) throw new Error(`basename(${basename}) is not a Query type.`);
		this._basename = basename;
	}
	get basename () { return this._basename; }

	/**
	 * @public
	 * @instance
	 * @function setbasedir
	 * @version 0.0.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Set project's base directory.
	 *
	 * @param {Path} _path - Strting point for search base directory.
	 * @throws {Error} Failed searching base directory of project.
	 *
	 * @example
	 * .setbasedir('./')
	 */
	set basedir (_path) {
		type.isFile(_path) && (_path = path.dirname(_path));
		if (!type.isDir(_path)) throw new Error(`_path(${_path}) does not exist directory.`);
		if (type.isRoot(_path)) throw new Error(`_path(${_path}) cannot be a root.`);
		let basedir;
		if (Array.isArray(this.basename)) {
			this.basename.some(name => {
				let tmpLoc = path.locateBase(_path, name);
				!type.isRoot(tmpLoc) && (basedir = tmpLoc);
			});
		} else {
			basedir = path.locateBase(_path, this.basename);
		}
		if (type.isRoot(basedir) || basedir == null) throw new Error(`_path(${_path}) has no parent node name of basename(${this.basename})`);
		this._basedir = basedir;
	}
	get basedir () { return this._basedir; }

	/**
	 * @public
	 * @instance
	 * @function setwd
	 * @version 0.0.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Set working directory based on current project's base directory.
	 *
	 * @param {ProjectPath} _path - Sub path of base directory.
	 *
	 * @example
	 * .setwd('abcdef')
	 */
	set wd (_path) {
		let wd = this.resolve(_path);
		wd != null && (this._workingDir = wd);
	}
	get wd () { return this._workingDir || this.basedir; }

	/**
	 * @public
	 * @instance
	 * @function resolve
	 * @version 0.0.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Resolving the path based on current project's base directory.
	 *
	 * @param {ProjectPath} _path - to resolve path.
	 * @throws {Error} _path is not a string type.
	 * @returns {Path} resolved path.
	 *
	 * @example
	 * .resolve('/abcd/efgh')
	 */
	resolve (_path) {
		if (typeof _path !== 'string') throw new Error(`_path(${_path}) is not a string type.`);
		if (path.isAbsolute(_path)) {
			_path = path.resolve(this.basedir, _path.substr(1));
		} else {
			_path = path.resolve(this.wd || this.basedir, _path);
		}

		// out of project directory.
		if (!path.equal(this.basedir, _path) &&
			!path.isParent(this.basedir, _path)) 
			return null;
		
		return _path;
	}

	/**
	 * @public
	 * @instance
	 * @function retrieve
	 * @version 0.0.4
	 * @since 0.0.4
	 * @created 2017-12-27
	 * @memberof module:index~ProjectDir
	 * @description Retrieve project path from absolute real path.
	 *
	 * @param {AbsPath} _path - absolute real path.
	 * @throws {Error} If not a string type, If not an absolute path.
	 * @returns {ProjectAbsPath} absolute project path.
	 *
	 * @example
	 * .retrieve(/home/user/abcd/efgh) // => /abcd/efgh (if /home/user is root)
	 */
	retrieve (_path) {
		if (typeof _path !== 'string') throw new Error(`_path(${_path}) is not a string type.`);
		if (!path.isAbsolute(_path)) throw new Error(`_path(${_path}) is not an absolute path.`);
		if (path.equal(this.basedir, _path)) return "/";
		if (!path.isParent(this.basedir, _path)) return null;
		let relPath = _path.substr(this.basedir.length);
		if (relPath[0] != '/') relPath = '/' + relPath;
		return relPath;
	}

	/**
	 * @public
	 * @instance
	 * @function parse
	 * @version 0.0.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Parsing a path.
	 *
	 * @param {ProjectPath} _path - to parse path.
	 * @throws {Error} _path is not a string type.
	 * @returns {Object} parsed path's object.
	 *
	 * @example
	 * .parse('abcd')
	 */
	parse (_path) {
		if (typeof _path !== 'string') throw new Error(`_path(${_path}) is not a string type.`);
		let rPath = this.resolve(_path);
		let ret = {
			root: this.basedir,
			names: this.basename,
			wd: this.wd,
			path: path.relative(this.wd, rPath),
			abs: "/"+path.relative(this.basedir, path.resolve(this.wd, rPath)),
			realPath: path.resolve(this.wd, rPath)
		};
		return ret;
	}
}

module.exports = ProjectDir;
