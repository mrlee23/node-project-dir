const path = require('path'),
	  fs = require('fs'),
	  type = require('./typeCheck.js');

let Path = {
	__proto__: path.__proto__
};
Object.getOwnPropertyNames(path).forEach(function (key) {
    Object.defineProperty(Path, key, Object.getOwnPropertyDescriptor(path, key));
});

Object.assign(Path, {
	locateBase: function (_path, regexp) {
		if (!fs.existsSync(_path)) throw new Error(`_path(${_path}) does not exist.`);
		return this.toRoot(_path, (basedir, nodes) => {
			return nodes.some(node => node.match(regexp));
		});
	},
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
	equal: function (path1, path2) {
		return path.relative(path1, path2).length == 0;
	},
	isParent: function (path1, path2) {
		let self = this;
		return type.isRoot(this.toRoot(path.dirname(path2), p => {
			return self.equal(path1, p);
		})) != true;
	}
});

module.exports = Path;
