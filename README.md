# [node-project-dir](https://github.com/mrlee23/node-project-dir)

[![Build Status](https://secure.travis-ci.org/mrlee23/node-project-dir.png)](https://travis-ci.org/mrlee23/node-project-dir)
[![Version](https://img.shields.io/npm/v/project-dir.svg)](https://www.npmjs.com/package/project-dir)
[![License](https://img.shields.io/github/license/mrlee23/node-project-dir.svg)](https://github.com/mrlee23/node-project-dir/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/project-dir.png)](https://nodei.co/npm/project-dir/)

>Manipulate project directories and files.

## Install
```shell
npm install project-dir
```

## Documentation
- [on GitHub Pages](https://mrlee23.github.io/node-project-dir/)

## Unit Test
### Dev Depencencies
- [mocha](https://github.com/mochajs/mocha) : unit test framework
- [one-mocha](https://github.com/mrlee23/node-one-mocha) : mocha tester generating module
- [js-doc](https://github.com/jsdoc3/jsdoc) : documentation generator
- [minami](https://github.com/Nijikokun/minami) : jsdoc template

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
Don't confuse `ProjectPath` argument. It has a difference meaning with normal path.
When the argument takes `ProjectPath`, do not use absolute path in real file system.
This moudle handles root as sub directory of base directory when argument is `ProjectPath`.

eg. If base directory is "/home/user/abcd", the `Path`'s "/efgh" means "/efgh" and the `ProjectPath`'s "/efgh" means "/home/user/abcd/efgh".
### constructor
### getter/setter
- `basename <Query>` : get/set basename for dominating file.
- `basedir <Path> ` : get/set project's base directory.
- `wd <Path>` : get/set project's working directory.

### project path parsing
- `resolve <ProjectPath>` : Resolving path based on basedir
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
