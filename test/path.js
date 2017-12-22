const genMocha = require('one-mocha'),
	  path = require('../lib/path.js');

class pathTester {
	test () {
		genMocha(
			[{
				method: path.toRoot,
				this: path,
				name: 'toRoot',
				test:
				[
					{
						assert: 'equal',
						args: [[__dirname, () => {}, "/"],
							   ["./", () => {}, "/"],
							   ["./", {resolve: false}, () => {}, "../../../../../../../"],
							   [__dirname, (path) => path==__dirname, __dirname]]
					},
					{
						assert: 'throws',
						args: [[__dirname, null, Error],
							   [__dirname+"/not_exists_path", Error]]
					}
				]
			},
			 {
				 method: path.locateBase,
				 this: path,
				 name: 'locateBase',
				 test:
				 [{
					 assert: 'equal',
					 args: [[__dirname, "node_modules", path.join(__dirname, "../")],
							[__dirname, "README", path.join(__dirname, "../")],
							[path.join(__dirname, "../lib"), "\\.js", path.join(__dirname, "../lib")]]
				 }]
			 },
			 {
				 method: path.equal,
				 this: path,
				 name: 'equal',
				 test:
				 [{
					 assert: 'equal',
					 args: [[__dirname, __dirname, true],
							[__dirname, __filename, false],
							['/', "../../../../../../../", true]]
				 }]
			 }]
			,{truncate: 40}
		);
	}
}

module.exports = new pathTester();
