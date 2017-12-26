const type = require('./lib/typeCheck.js'),
	  path = require('./lib/path.js');

class ProjectDir {
	constructor(currentPath, basename) {
		(basename == null) && (this.basename = [".git", "package.json"]);
		this.basename = basename;
		this.basedir = currentPath;
	}

	_setBase () {
		let basename = this.basename;
	}

	set basename (basename) {
		if (!type.isQuery(basename)) throw new Error(`basename(${basename}) is not a query type.`);
		this._basename = basename;
	}
	get basename () { return this._basename; }

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

	set wd (_path) {
		let wd = this.resolve(_path);
		wd != null && (this._workingDir = wd);
	}
	get wd () { return this._workingDir || this.basedir; }

	resolve (_path) {
		if (typeof _path !== 'string') throw new Error(`_path(${_path}) is not a string type.`);
		if (type.isAbs(_path)) {
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
