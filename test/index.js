const genMocha = require('one-mocha'),
	  path = require('path'),
	  index = require('../index.js');

let projectDir = new index("./", "node_modules");
class indexTester {
	test () {
		genMocha(
			[
				{
					method: () => { return projectDir.basename; },
					name: 'get basename',
					test: {
						assert: 'equal',
						args: [["node_modules"]]
					}
				},
				{
					method: () => { return projectDir.basedir; },
					name: 'get basedir',
					test: {
						assert: 'equal',
						args: [[path.resolve(__dirname, '../')]]
					}
				}

			]
		);
	}
}

module.exports = new indexTester();
