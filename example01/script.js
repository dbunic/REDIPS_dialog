/* eslint-env browser */
/* eslint
   semi: ["error", "always"],
   indent: [2, "tab"],
   no-tabs: 0,
   no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
   one-var: ["error", "always"] */
/* global REDIPS */

/* enable strict mode */
'use strict';

// create redips container
let redips = {};


// dialog box initialization (called from onload event)
redips.init = function () {
	// reference to the REDIPS.dialog lib
	let rd = REDIPS.dialog;
	// initialization
	rd.init();
	// define custom HTML
	rd.html('<div style="text-align:center"><a href="http://www.redips.net/" title="REDIPS site">www.redips.net</a><br/><br/>This is my HTML</div>');
	// define close button
	// rd.close_button = 'Z';
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
