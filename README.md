# [node-project-dir](https://github.com/mrlee23/node-project-dir)

[![Build Status](https://secure.travis-ci.org/mrlee23/node-project-dir.png)](https://travis-ci.org/mrlee23/node-project-dir)
[![Version](https://img.shields.io/npm/v/project-dir.svg)](https://www.npmjs.com/package/project-dir)
[![License](https://img.shields.io/github/license/mrlee23/node-project-dir.svg)](https://github.com/mrlee23/node-project-dir/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/project-dir.png)](https://nodei.co/npm/project-dir/)

>Search the project's root directory.

## Install
```shell
npm install project-dir
```

## Documentation
- [on GitHub Pages](https://mrlee23.github.io/node-project-dir/)

## How to use
```
myProject/
├── .git
├── node_modules
├── aaaa
│   └── bbbb
└── abcd
    └── efgh
```

### require
```javascript
const ProjectDir = require('project-dir');
```

### on NodeJS
```javascript
const myProject = new ProjectDir('./', 'node_modules')

console.log(myProject.basedir); // => '/home/user/myProject'
console.log(myProject.wd); // => '/home/user/myProject'
```

### on git repository
```javascript
const myProject = new ProjectDir('./', '.git')

console.log(myProject.basedir); // => '/home/user/myProject'
console.log(myProject.wd); // => '/home/user/myProject'
```

### make sure NodeJS with git repository
```javascript
const myProject = new ProjectDir('./', ['node_modules', '.git'])

console.log(myProject.basedir); // => '/home/user/myProject'
console.log(myProject.wd); // => '/home/user/myProject'
```

### set basename
```javascript
console.log(myProject.basename); // => ['node_modules', '.git']

myProject.basename = '.git'

console.log(myProject.basename); // => '.git'
```

### set basedir
```javascript
myProject.basedir = './abcd'; // => '/home/user/myProject'
myProject.wd; // => '/home/user/myProject/abcd'

myProject.basedir = './abcd/efgh'; // => '/home/user/myProject'
myProject.wd; // => '/home/user/myProject/abcd/efgh'
```

### set wd (working directory)
```javascript
// root
myProject.wd = '/'; // => '/home/user/myProject'

// relative path
myProject.wd = 'abcd'; // => '/home/user/myProject/abcd'
myProject.wd = 'efgh'; // => '/home/user/myProject/abcd/efgh'
myProject.wd = '../'; // => '/home/user/myProject/abcd'

myProject.wd = '/aaaa'; // => '/home/user/myProject/aaaa'
```

### resolve
```javascript
myProject.wd = '/';
myProject.resolve('abcd'); // => '/home/user/myProject/abcd'

myProject.wd = '/aaaa';
myProject.resolve('bbbb'); // => '/home/user/myProject/aaaa/bbbb'

myProject.wd = '/aaaa';
myProject.resolve('/abcd'); // => '/home/user/myProject/abcd'
```

### retrieve
```javascript
myProject.retrieve('/home/user/myProject/abcd'); // => '/abcd'

myProject.retrieve('/home/user/myProject/abcd/efgh'); // => '/abcd/efgh'

myProject.retrieve('/home/user/myProject'); // => '/'

myProject.retrieve('/home/user'); // => 'null'
```

### parse
```javascript
myProject.parse('/abcd');
```

```javascript
{
  root: '/home/user/myProject',
  names: '.git',
  wd: '/home/user/myProject',
  path: 'abcd',
  abs: '/abcd',
  realPath: '/home/user/myProject/abcd'
}
```

```javascript
myProject.wd = '/abcd';
myProject.parse('efgh');
```

```javascript
{
  root: '/home/user/myProject',
  names: '.git',
  wd: '/home/user/myProject/abcd',
  path: 'efgh',
  abs: '/abcd/efgh',
  realPath: '/home/user/myProject/abcd/efgh'
}
```

### equal
```javascript
myProject.wd = '/abcd'
console.log(myProject.wd); // => '/home/user/myProject/abcd'

myProject.equal('/abcd/efgh', 'efgh'); // => true
myProject.equal('/aaaa', '../aaaa'); // => true
myProject.equal('/abcd', 'abcd'); // => false
```

### toRoot
```javascript
let paths = [];
myProject.toRoot('/abcd/efgh', (curPath) => paths.push(curPath));
console.log(curPath); // => ['/abcd/efgh', '/abcd']
```

## API
Don't confuse `ProjectPath` argument. It has a difference meaning with normal path.
When the argument takes `ProjectPath`, do not use absolute path in real file system.
This moudle handles root as sub directory of base directory when argument is `ProjectPath`.

eg. If base directory is "/home/user/abcd", the `Path`'s "/efgh" means "/efgh" and the `ProjectPath`'s "/efgh" means "/home/user/abcd/efgh".

- `constructor(<Path>, <Query>)` : Search a `Query` matched directory from `Path` to root path. and set basedir.
### getter/setter
- `basename <Query>` : get/set basename for dominating file.
- `basedir <Path> ` : get/set project's base directory.
- `wd <Path>` : get/set project's working directory.

### methods
- `resolve(<ProjectPath>) -> <Path>` : Resolving path based on basedir
- `retrieve(<Path>) -> <ProjectAbsPath>` : Retrieving project path from absolute real path.
- `parse(<ProjectPath>) -> <Object>` : parsing path based on basedir. below output is result of path(+ sign means `path.resolve`, * sign means `path.relative`, path means argument, others are property name).
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
- `equal(<ProjectPath>, <ProjectPath>) -> <boolean>` : Compare with two project path is same.
- `toRoot(<ProjectPath>, [<Object>, ]<Function>)` : Recursively access from `ProjectPath` to `basedir` and send an argument of current path to `Function`.

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
