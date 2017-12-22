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
		let basedir = path.locateBase(_path, this.basename);
		if (path.equal(basedir, "/")) throw new Error(`_path(${_path}) has no parent node name of basename(${this.basename})`);
		this._basedir = basedir;
	}

	get basedir () { return this._basedir; }
}

module.exports = ProjectDir;
