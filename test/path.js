const oneMocha = require('one-mocha'),
	  path = require('../lib/path.js');

class pathTester {
	test () {
		oneMocha(
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
							   ["./", {resolve: false}, () => {}, path.relative('./', '/')+'/'],
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
			 },
			 {
				 method: path.isParent,
				 this: path,
				 name: 'isParent',
				 test:
				 [{
					 assert: 'equal',
					 args: [[__dirname, __dirname, false],
							[__dirname, path.resolve(__dirname, "../"), false],
							[path.resolve(__dirname, "../"), __dirname, true]]
				 }]
			 }]
			,{truncate: 40}
		);
	}
}

module.exports = new pathTester();
