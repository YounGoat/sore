/**
 * @see https://www.gnu.org/software/findutils/manual/html_node/find_html/Shell-Pattern-Matching.html
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	;

function pattern2regexp(pattern, text) {
	let re = pattern;
	
	re = re.replace(/\./g, '\\.');
	re = re.replace(/\*/g, '.+');
	re = re.replace(/\?/g, '.');
	
	re = `^${re}$`;
	re = new RegExp(re);

	return re;
}

module.exports = pattern2regexp;