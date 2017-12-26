# node-project-dir

>Manipulate project directories and files.

## Install
```shell
npm install project-dir
```

## Unit Test
### Dev Depencencies
- [mocha](https://github.com/mochajs/mocha) : unit test framework
- [one-mocha](https://github.com/mrlee23/node-one-mocha) : mocha tester generating module

### Test
```shell
npm test
```

## How to use
```javascript
const ProjectDir = require('project-dir');
const myProjectDir = new ProjectDir('./', 'node_modules') // searching base directory has a node_modules directory

console.log(myProjectDir.resolve('/abcd'));
```

## API
### constructor
### getter/setter
- `basename` : get/set basename for dominating file.
- `basedir` : get/set project's base directory.
- `wd` : get/set project's working directory.

### project path parsing
- `resolve`(string path) : resolving path based on basedir
- `parse`(string path) : parsing path based on basedir
