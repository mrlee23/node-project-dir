const oneMocha = require('one-mocha'),
	  path = require('path'),
	  index = require('../index.js');

let projectDir = new index(path.resolve(__dirname, 'test-project'), "node_modules");
class indexTester {
	test () {
		oneMocha(
			[
				{
					method: (arg) => { projectDir.basename = arg;
									   return projectDir.basename;
									 },
					name: 'get/set basename',
					test:
					[
						{
							assert: 'doesNotThrow',
							args: [["node_modules", undefined],
								   [["node_modules", ".git", "Makefile"], undefined],
								   [["node_modules"], undefined]]
						},
						{
							assert: 'throws',
							args: [[1, Error],
								   [[1], Error],
								   [{}, Error]]
						},
						{
							assert: 'equal',
							args: [["node_modules", "node_modules"]]
						},
						{
							assert: 'deepEqual',
							args: [[["node_modules", ".git", "Makefile"], ["node_modules", ".git", "Makefile"]]]
						}
					]
				},
				{
					method: (arg) => { projectDir.basedir = arg;
									   return projectDir.basedir;
									 },
					name: 'get/set basedir',
					test:
					[
						{
							assert: 'doesNotThrow',
							args: [[path.resolve(__dirname, 'test-project'), undefined]
								  ]
						},
						{
							assert: 'throws',
							args: [["/", Error]]
						},
						{
							assert: 'equal',
							args: [[path.resolve(__dirname, "test-project"), path.resolve(__dirname, "test-project")],
								   [path.resolve(__dirname, "test-project/sample"), path.resolve(__dirname, "test-project") + "/"],
								   [path.resolve(__dirname, "test-project/README.md"), path.resolve(__dirname, "test-project")]]
						}
					]
				},
				{
					method: projectDir.resolve,
					name: 'resolve',
					this: projectDir,
					test: {
						assert: 'equal',
						args: [["/", path.resolve(__dirname, 'test-project')],
							   ["/abcdef", path.resolve(__dirname, 'test-project/abcdef')],
							   ["abcdef", path.resolve(__dirname, 'test-project/abcdef')],
							   ["./", path.resolve(__dirname, 'test-project')],
							   ["../", null]]
					}
				},
				{
					method: projectDir.retrieve,
					name: 'retrieve',
					this: projectDir,
					test: {
						assert: 'equal',
						args: [[path.resolve(__dirname, 'test-project'), '/'],
							   [path.resolve(__dirname, 'test-project/abcdef'), '/abcdef'],
							   [path.resolve(__dirname, 'test-project/efgh'), '/efgh'],
							   [path.resolve(__dirname, '../'), null]]
					}
				},
				{
					method: (arg) => { projectDir.wd = arg;
									   return projectDir.wd;},
					name: 'get/set wd',
					test: {
						assert: 'equal',
						args: [["/", path.resolve(__dirname, 'test-project')],
							   ["/abcd", path.resolve(__dirname, 'test-project/abcd')],
							   ["efgh", path.resolve(__dirname, 'test-project/abcd/efgh')],
							   ["../", path.resolve(__dirname, 'test-project/abcd/')],
							   ["/", path.resolve(__dirname, 'test-project/')],
							   ["../", path.resolve(__dirname, 'test-project')]]
					}
				},
				{
					method: (arg) => projectDir.parse(arg).root,
					name: 'parse',
					test: {
						assert: 'equal',
						args: [["/abcd", path.resolve(__dirname, 'test-project')]]
					}
				},
				{
					method: (arg) => {
						return {
							root: projectDir.parse(arg).root,
							abs: projectDir.parse(arg).abs,
							realPath: projectDir.parse(arg).realPath
						};
					},
					name: 'parse',
					this: projectDir,
					test: {
						assert: 'deepEqual',
						args: [["/abcd", {
							root: path.resolve(__dirname, 'test-project'),
							abs: '/abcd',
							realPath: path.resolve(__dirname, 'test-project/abcd')
						}]]
					}
				}
			]
		);
	}
}

module.exports = new indexTester();
