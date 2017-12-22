const fs = require('fs');
const typeChecker = function () {
};
typeChecker.prototype.isArrayQuery = function (arg) {
	if (!Array.isArray(arg)) return false;
	if (!arg.every(elem => typeof elem === 'string' || (elem instanceof RegExp))) return false;
	return true;
};
typeChecker.prototype.isQuery = function (arg) {
	if (typeof arg === 'string' || (arg instanceof RegExp) || this.isArrayQuery(arg))
		return true;
	return false;
};
typeChecker.prototype.isFile = function (arg) {
	return typeof arg === 'string' && fs.existsSync(arg) && fs.lstatSync(arg).isFile();
};
typeChecker.prototype.isDir = function (arg) {
	return typeof arg === 'string' && fs.existsSync(arg) && fs.lstatSync(arg).isDirectory();
};

module.exports = new typeChecker();
