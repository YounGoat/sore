#	sore

The package name "sore" may be interpreted as character-reversed "Eros" who is ["the Greek god of sensual love and desire"][1]. Another way to remember the name is to regard it as the combination of "shell" and "core". This is my way!

![Shell Core][0]

__This package is a collection.__ Depending on this package, you may develop in Node.js with APIs which offer functions similiar with basic / frequently-used \*nix commands.

##	Table of Contents

* [Get Start](#get-start)
* [API](#api)
* [References](#references)

##	Get Start

Require all sub-modules at once.
```javascript
const sore = require('sore');

sore.find({
	basepath: '/var/log',
	type: 'd',
}, (err, data) => {
	// ...
});
```

Or, require specified sub module directly.
```javascript
const find = require('sore/find');

find({
	basepath: '/var/log',
	type: 'd',
}, (err, data) => {
	// ...
});
```

##	API

Most of sub modules are designed to be asynchronous and conform to [PoC][2] pattern. Here are available sub modules：
*	[find](docs/find.md)

##	References

[0]: docs/sore.png
[1]: https://en.wikipedia.org/wiki/Eros
[2]: https://github.com/YounGoat/articles/blob/master/2019/PoC.md
