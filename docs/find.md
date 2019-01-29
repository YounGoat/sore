#	sore/find

Stand-in of \*nix command [find][1].

##	Get Start

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

The function is conformed to [PoC][2] pattern.

*	Promise | void __find__(object *options* [, Function *callback* ])

Parameters may include:

*	__options.streamable__ *boolean* DEFAULT `false`   
    Whether to return a readable stream.

*	__options.basepath__ *string* REQUIRED  
	Base path.
	
*	__options.type__ *string* DEFAULT `'*'`  
	Indicate type of items to be found.  
	This option should be a string in which each character represent a 

*	__options.iname__ *string* OPTIONAL  
	Case-insensitive file name pattern.

*	__options.ipath__ *string* OPTIONAL  
	Case-insensitive file path pattern.

*	__options.name__ *string* | *RegExp* OPTIONAL  
	Case-sensitive file name pattern or regular expression.

*	__options.path__ *string* | *RegExp* OPTIONAL  
	Case-sensitive file path pattern or regular expression.

*	__options.no-iname__ *string* OPTIONAL  
	Exclude those matching the case-insensitive file name pattern.

*	__options.no-ipath__ *string* OPTIONAL  
	Exclude those matching the case-insensitive path pattern.

*	__options.no-name__ *string* OPTIONAL  
	Exclude those matching the case-sensitive file name pattern or regular expression.

*	__options.no-path__ *string* OPTIONAL  
	Exclude those matching the case-sensitive file name pattern or regular expression.
	

##	Reference

[1]: https://ss64.com/bash/find.html
[2]: https://github.com/YounGoat/articles/blob/master/2019/promisify.md
