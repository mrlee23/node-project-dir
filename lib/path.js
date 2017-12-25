const path = require('path'),
	  fs = require('fs'),
	  deasync = require('deasync'),
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
			resolve: true
		}, options);
		if (!fs.existsSync(_path)) throw new Error(`_path(${_path}) does not exist.`);
		if (typeof callback !== 'function') throw new Error(`The callback function does not set.`);
		options.resolve && (_path = path.resolve(_path));
		while (path.resolve(_path) != '/') {
			!fs.lstatSync(_path).isDirectory() && (_path = path.dirname(_path));
			let nodes = fs.readdirSync(_path);
			if (callback(_path, nodes) == true) break; // to exit when callback returns true.
			_path = path.join(_path, '../');
		}
		return _path;
	},
	equal: function (path1, path2) {
		return path.relative(path1, path2).length == 0;
	},
	isParent: function (path1, path2) {
		return path.relative(path2, path1).match(/^\.\.[\/]?/g) != null;
	}
});

module.exports = Path;
