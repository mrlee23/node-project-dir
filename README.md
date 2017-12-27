# node-project-dir ![Build Status](https://secure.travis-ci.org/mrlee23/node-project-dir.png)
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
- `basename <Query>` : get/set basename for dominating file.
- `basedir <Path> ` : get/set project's base directory.
- `wd <Path>` : get/set project's working directory.

### project path parsing
- `resolve <ProjectPath>` : resolving path based on basedir
- `retrieve <AbsPath>` : Retrieving project path from absolute real path.
- `parse <ProjectPath>` : parsing path based on basedir. below output is result of path(+ sign means `path.resolve`, * sign means `path.relative`, path means argument, others are property name).
```javascript
{
	root: <basedir>,
	names: <basename>,
	wd: <wd>,
	path: <wd*path>,
	abs: <basedir*(wd+path)>,
	realPath: <wd+path>
}
```
