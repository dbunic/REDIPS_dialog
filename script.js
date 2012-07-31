/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


// create redips container
var redips = {};


// dialog box initialization (called from onload event)
redips.init = function () {
	REDIPS.dialog.init();
	REDIPS.dialog.op_high = 60;
	REDIPS.dialog.fade_speed = 18;
	//REDIPS.dialog.close_button = 'Z';
	// if 'html' string is send as parameter in REDIPS.dialog.show() then this HTML will be used
	REDIPS.dialog.html('<div><a href="http://www.redips.net/" title="REDIPS site">www.redips.net</a><br/><br/>This is my HTML</div>');
};


// execute after button1 is clicked 
function button1() {
	alert('Hi from function button1!');
}


// execute after button2 is clicked
function button2(param) {
	var msg = 'Hi from function button2!';
	// if parameter exists
	if (param !== undefined) {
		msg += '\nParameter: ' + param;
	}
	alert(msg);
}


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}