/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


// create redips container
var redips = {};


// dialog box initialization (called from onload event)
redips.init = function () {
	// reference to the REDIPS.dialog lib
	var rd = REDIPS.dialog;
	// initialization
	rd.init();
	// define custom HTML
	rd.html('<div style="text-align:center"><a href="http://www.redips.net/" title="REDIPS site">www.redips.net</a><br/><br/>This is my HTML</div>');
	// define close button
	//rd.close_button = 'Z';
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}