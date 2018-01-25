const oneMocha = require('one-mocha'),
	  path = require('path'),
	  index = require('../index.js');

let projectDir = new index(path.resolve(__dirname, 'test-project'), "node_modules");
const GLOBAL = {};
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
					test: [
						{
							assert: 'equal',
							args: [["/", path.resolve(__dirname, 'test-project')],
								   ["/abcd", path.resolve(__dirname, 'test-project/abcd')],
								   ["efgh", path.resolve(__dirname, 'test-project/abcd/efgh')],
								   ["../", path.resolve(__dirname, 'test-project/abcd/')],
								   ["/", path.resolve(__dirname, 'test-project/')]]
						},
						{
							assert: 'throws',
							args: [["../", Error]]
						}
					]
				},
				{
					method: (arg) => projectDir.parse(arg).root,
					name: 'parse',
					desc: 'root test',
					test: {
						assert: 'equal',
						args: [["/abcd", path.resolve(__dirname, 'test-project')]]
					}
				},
				{
					method: (arg) => projectDir.parse(arg).realPath,
					name: 'parse',
					desc: 'realPath test',
					test: {
						assert: 'equal',
						args: [["/abcd", path.resolve(__dirname, 'test-project/abcd')],
							   ["/../", path.resolve(__dirname)],
							   ["/../../", path.resolve(__dirname, '../')],
							   ["../../", path.resolve(__dirname, '../')]]
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
				},
				{
					method: (arg) => {
						projectDir.wd = projectDir.retrieve(path.resolve(projectDir.basedir, "sample"));
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
				},
				{
					method: (arg1, arg2) => {
						projectDir.wd = '/aaaa';
						return projectDir.equal(arg1, arg2);
					},
					name: 'equal',
					this: projectDir,
					test: {
						assert: 'equal',
						args: [['/aaaa/abcd', 'abcd', true],
							   ['/aaaa/abcd', 'efgh', false],
							   ['/aaaa/efgh', 'efgh', true],
							   ['/aaaa', '../aaaa', true]]
					}
				},
				{
					method: (arg1, arg2, equality = []) => {
						GLOBAL.toRoot = [];
						projectDir.wd = '/bbbb';
						projectDir.toRoot(arg1, arg2);
						return GLOBAL.toRoot.every((elem, i) => {
							if (projectDir.equal(elem, equality[i])) {
								return true;
							} else {
								console.log("-"+elem);
								console.log("+"+equality[i]);
								return false;
							}
						});
					},
					name: 'toRoot',
					this: projectDir,
					test: {
						assert: 'equal',
						args: [
							['/abcd/efgh', (p) => {
								!Array.isArray(GLOBAL.toRoot) && (GLOBAL.toRoot = []);
								GLOBAL.toRoot.push(projectDir.retrieve(p));
							}, ['/abcd/efgh', '/abcd'], true],
							['abcd/efgh', (p) => {
								!Array.isArray(GLOBAL.toRoot) && (GLOBAL.toRoot = []);
								GLOBAL.toRoot.push(projectDir.retrieve(p));
							}, ['/bbbb/abcd/efgh', '/bbbb/abcd', '/bbbb'], true]
						]
					}
				}
			]
		);
	}
}

module.exports = new indexTester();
