/**
 * @fileOverview Manipulate project directories and files.
 * @name index.js
 * @author Dongsoo Lee <mrlee_23@naver.com>
 * @copyright 2018 Dongsoo Lee <mrlee_23@naver.com>
 * @module index
 * @version 0.1.4
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
 * @version 0.1.4
 * @since 0.0.1
 * @created 2017-12-26
 */
class ProjectDir {
	/**
	 * @public
	 * @instance
	 * @function constructor
	 * @version 0.1.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Generating new project directory object.
	 *
	 * @param {Path} currentPath - Starting point for search base directory. This path must be an existing file or directory.
	 * @param {Query} basename - Dominating file or directory names.
	 *
	 * @example
	 * const myProject = new ProjectDir('./', 'node_modules')
	 *
	 * const myProject2 = new ProjectDir('./', '.git')
	 *
	 * const myProject3 = new ProjectDir('./', ['node_modules', '.git']) // has node_modules and .git directory
	 */
	constructor(currentPath, basename) {
		(basename == null) && (this.basename = [".git", "package.json"]);
		this.basename = basename;
		this.basedir = currentPath;
	}

	/**
	 * @public
	 * @instance
	 * @function set_basename
	 * @version 0.1.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Set dominating file or directory names.
	 *
	 * @param {Query} basename - Dominating file or directory names.
	 * @throws {Error} Not a Query type.
	 *
	 * @example
	 * myProject.basename = ['.git', 'package.json']
	 */
	set basename (basename) {
		if (!type.isQuery(basename)) throw new Error(`basename(${basename}) is not a Query type.`);
		this._basename = basename;
	}

	/**
	 * @public
	 * @instance
	 * @function get_basename
	 * @version 0.1.4
	 * @since 0.0.1
	 * @created 2018-01-22
	 * @memberof module:index~ProjectDir
	 * @description Get basename of current project
	 *
	 * @returns {Path} Current basenames.
	 *
	 * @example
	 * myProject.basename // => ['.git', 'package.json']
	 */
	get basename () { return this._basename; }

	/**
	 * @public
	 * @instance
	 * @function set_basedir
	 * @version 0.1.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Set project's base directory.
	 *
	 * @param {Path} _path - Strting point for search base directory.
	 * @throws {Error} Failed searching base directory of project.
	 *
	 * @example
	 * myProject.basedir = './abcd'; // => '/home/user/myProject'
	 * myProject.wd; // => '/home/user/myProject/abcd'
	 *
	 * myProject.basedir = './abcd/efgh'; // => '/home/user/myProject'
	 * myProject.wd; // => '/home/user/myProject/abcd/efgh'
	 */
	set basedir (_path) {
		_path = path.resolve(_path);
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
		this.wd = this.retrieve(_path);
	}

	/**
	 * @public
	 * @instance
	 * @function get_basedir
	 * @version 0.1.4
	 * @since 0.0.1
	 * @created 2018-01-22
	 * @memberof module:index~ProjectDir
	 * @description Get base directory of current project.
	 *
	 * @returns {Path} Current base directory's absolute path.
	 *
	 * @example
	 * myProject.basedir // => '/home/user/myProject'
	 */
	get basedir () { return this._basedir; }

	/**
	 * @public
	 * @instance
	 * @function set_wd
	 * @version 0.1.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Set working directory based on current project's base directory.
	 *
	 * @param {ProjectPath} _path - Sub path of base directory.
	 * @throws {Error} Out of range in root path.
	 *
	 * @example
	 * // root
	 * myProject.wd = '/'; // => '/home/user/myProject'
	 * 
	 * // relative path
	 * myProject.wd = 'abcd'; // => '/home/user/myProject/abcd'
	 * myProject.wd = 'efgh'; // => '/home/user/myProject/abcd/efgh'
	 * myProject.wd = '../'; // => '/home/user/myProject/abcd'
	 * 
	 * myProject.wd = '/aaaa'; // => '/home/user/myProject/aaaa'
	 */
	set wd (_path) {
		let wd = this.resolve(_path);
		if (wd == null) throw new Error(`working directory path(${_path}) is out of range in root path.`);
		wd != null && (this._workingDir = wd);
	}
	
	/**
	 * @public
	 * @instance
	 * @function get_wd
	 * @version 0.1.4
	 * @since 0.0.1
	 * @created 2018-01-22
	 * @memberof module:index~ProjectDir
	 * @description Get current working directory.
	 *
	 * @returns {Path} Current working directory's absolute path.
	 *
	 * @example
	 * myProject.wd // => '/home/user/myProject/abcd'
	 */
	get wd () { return this._workingDir || this.basedir; }

	/**
	 * @public
	 * @instance
	 * @function resolve
	 * @version 0.1.4
	 * @since 0.0.1
	 * @created 2017-12-26
	 * @memberof module:index~ProjectDir
	 * @description Resolving the path based on current project's base directory.
	 *
	 * @param {ProjectPath} _path - to resolve path.
	 * @throws {Error} _path is not a string type.
	 * @returns {null|Path} resolved path or null out of range in root path.
	 *
	 * @example
	 * myProject.wd = '/';
	 * myProject.resolve('abcd'); // => '/home/user/myProject/abcd'
	 * 
	 * myProject.wd = '/aaaa';
	 * myProject.resolve('bbbb'); // => '/home/user/myProject/aaaa/bbbb'
	 * 
	 * myProject.wd = '/aaaa';
	 * myProject.resolve('/abcd'); // => '/home/user/myProject/abcd'
	 */
	resolve (_path) {
		if (typeof _path !== 'string') throw new Error(`_path(${_path}) is not a string type.`);
		if (path.isAbsolute(_path)) {
			_path = path.resolve(this.basedir, _path.substr(1));
		} else {
			_path = path.resolve(this.wd || this.basedir, _path);
		}

		// out of range in project directory.
		if (!path.equal(this.basedir, _path) &&
			!path.isParent(this.basedir, _path)) 
			return null;
		
		return _path;
	}

	/**
	 * @public
	 * @instance
	 * @function retrieve
	 * @version 0.1.4
	 * @since 0.0.5
	 * @created 2017-12-27
	 * @memberof module:index~ProjectDir
	 * @description Retrieve project path from absolute real path.
	 *
	 * @param {AbsPath} _path - absolute real path.
	 * @throws {Error} If not a string type, If not an absolute path.
	 * @returns {ProjectAbsPath} absolute project path.
	 *
	 * @example
	 * myProject.retrieve('/home/user/myProject/abcd'); // => '/abcd'
	 * 
	 * myProject.retrieve('/home/user/myProject/abcd/efgh'); // => '/abcd/efgh'
	 * 
	 * myProject.retrieve('/home/user/myProject'); // => '/'
	 * 
	 * myProject.retrieve('/home/user'); // => 'null'
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
	 * @version 0.1.4
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
	 * myProject.parse('/abcd');
	 * // {
	 * //   root: '/home/user/myProject',
	 * //   names: '.git',
	 * //   wd: '/home/user/myProject',
	 * //   path: 'abcd',
	 * //   abs: '/abcd',
	 * //   realPath: '/home/user/myProject/abcd'
	 * // }
	 * 
	 * myProject.wd = '/abcd';
	 * myProject.parse('efgh');
	 * // {
	 * //   root: '/home/user/myProject',
	 * //   names: '.git',
	 * //   wd: '/home/user/myProject/abcd',
	 * //   path: 'efgh',
	 * //   abs: '/abcd/efgh',
	 * //   realPath: '/home/user/myProject/abcd/efgh'
	 * // }
	 */
	parse (_path) {
		if (typeof _path !== 'string') throw new Error(`_path(${_path}) is not a string type.`);
		let rPath = this.resolve(_path);
		let ret = {
			root: this.basedir,
			names: this.basename,
			wd: this.wd,
			path: rPath == null ? null : path.relative(this.wd, rPath),
			abs: rPath == null ? null : "/"+path.relative(this.basedir, path.resolve(this.wd, rPath)),
			realPath: path.resolve(this.wd, rPath == null ? _path.replace(/^\//, '') : rPath)
		};
		return ret;
	}

	/**
	 * @public
	 * @instance
	 * @function equal
	 * @version 0.1.4
	 * @since 0.1.2
	 * @created 2018-01-23
	 * @memberof module:index~ProjectDir
	 * @description Check same directory in project directory
	 *
	 * @param {ProjectPath|ProjectAbsPath} _path1 - To check project path
	 * @param {ProjectPath|ProjectAbsPath} _path2 - To check project path
	 * @throws {Error} Type error
	 * @returns {boolean} If same directory, returns true
	 *
	 * @example
	 * myProject.wd = '/abcd'
	 * console.log(myProject.wd); // => '/home/user/myProject/abcd'
	 * 
	 * myProject.equal('/abcd/efgh', 'efgh'); // => true
	 * myProject.equal('/aaaa', '../aaaa'); // => true
	 * myProject.equal('/abcd', 'abcd'); // => false
	 */
	equal (_path1, _path2) {
		if (typeof _path1 !== 'string') throw new Error(`_path1(${_path1}) is not a string type.`);
		if (typeof _path2 !== 'string') throw new Error(`_path2(${_path2}) is not a string type.`);
		let p1 = this.resolve(_path1),
			p2 = this.resolve(_path2);
		return path.equal(p1, p2);
	}

	/**
	 * @public
	 * @instance
	 * @function toRoot
	 * @version 0.1.4
	 * @since 0.1.2
	 * @created 2018-01-23
	 * @memberof module:index~ProjectDir
	 * @description Go to root directory
	 *
	 * @param {ProjectPath|ProjectAbsPath} _path - Start point of project path.
	 * @param {Function} func - Recursively executed function. the argument is current path.
	 * @returns {Path} Root directory of project.
	 */
	toRoot (_path, ...args) {
		let callback = args.pop(),
			options = args[0] || {};
		options = Object.assign({
			resolve: undefined,
			reliable: undefined,
			checker: (_p) => path.equal(_p, this.basedir)
		}, options);
		return path.toRoot(this.resolve(_path), options, callback);
	}

	/**
	 * @public
	 * @instance
	 * @function fromRoot
	 * @version 0.1.4
	 * @since 0.1.4
	 * @created 2018-02-01 
	 * @memberof module:index~ProjectDir
	 * @description Go to _path from root path of current project.
	 *
	 * @param {ProjectPath|ProjectAbsPath} _path - End point of project path.
	 * @param {Function} func - Recursively executed function. the argument is current path.
	 * @returns {Path} _path directory of project if no breaks.
	 */
	fromRoot (_path, ...args) {
		let callback = args.pop(),
			options = args[0] || {};
		options = Object.assign({
			reliable: undefined,
			start: this.basedir,
			checker: (_p) => path.equal(_p, _path)
		}, options);
		return path.fromRoot(this.resolve(_path), options, callback);
	}
}

module.exports = ProjectDir;
