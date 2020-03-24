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
var redips = {};


// dialog box initialization (called from onload event)
redips.init = function () {
	REDIPS.dialog.init();
	REDIPS.dialog.op_high = 60;
	REDIPS.dialog.fade_speed = 18;
	// REDIPS.dialog.close_button = 'Z';
	// if 'html' string is send as parameter in REDIPS.dialog.show() then this HTML will be used
	REDIPS.dialog.html('<div><a href="http://www.redips.net/" title="REDIPS site">www.redips.net</a><br/><br/>This is my HTML</div>');
};


// execute after button1 is clicked
function button1 () { // eslint-disable-line no-unused-vars
	alert('Hi from function button1!');
};


// execute after button2 is clicked
function button2 (param) { // eslint-disable-line no-unused-vars
	var msg = 'Hi from function button2!';
	// if parameter exists
	if (param !== undefined) {
		msg += '\nParameter: ' + param;
	}
	alert(msg);
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
