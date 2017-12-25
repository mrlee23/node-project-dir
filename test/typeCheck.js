const genMocha = require('one-mocha'),
	  path = require('path'),
	  typeCheck = require('../lib/typeCheck.js');

class typeCheckTester {
	test () {
		genMocha(
			[{
				method: typeCheck.isArrayQuery,
				name: "isArrayQuery",
				this: typeCheck,
				test: {
					assert: 'equal',
					args: [["A", false],
						   [1, false],
						   [[], true],
						   [["A"], true],
						   [["A", 1], false],
						   [["B", /C/], true],
						   [["B", /C/, 2], false]]
				}
			},
			 {
			 	 method: typeCheck.isQuery,
			 	 name: "isQuery",
				 this: typeCheck,
			 	 test: {
			 		 assert: 'equal',
			 		 args: [["A", true],
			 				[1, false],
			 				[[], true],
			 				[["A"], true],
			 				[["A", 1], false],
			 				[["B", /C/], true],
			 				[["B", /C/, 2], false]]
			 	 }
			 },
			 {
				 method: typeCheck.isFile,
				 name: "isFile",
				 this: typeCheck,
				 test: {
					 assert: 'equal',
					 args: [[path.join(__dirname, "./test-project/README.md"), true],
							[path.join(__dirname, "./test-project/file-not-exist"), false]]
				 }
			 },
			 {
				 method: typeCheck.isDir,
				 name: "isDir",
				 this: typeCheck,
				 test: {
					 assert: 'equal',
					 args: [[path.join(__dirname, "./test-project/sample"), true],
							[path.join(__dirname, "./test-project/directory-not-exist"), false]]
				 }
			 },
			 {
				 method: typeCheck.isRoot,
				 name: 'isRoot',
				 this: typeCheck,
				 test: {
					 assert: 'equal',
					 args: [["/", true],
							[__dirname, false],
							["../../../../../../../../../../../../../../", true],
						   	[[], false],
						   	[{}, false],
						   	[true, false],
							[false, false]]
				 }
			 }
			]
		);
	}
}

module.exports = new typeCheckTester();
