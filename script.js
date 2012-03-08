/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init variable
var redips_init;

// dialog box initialization (called from onload event)
redips_init = function () {
	REDIPS.dialog.init();
	REDIPS.dialog.op_high = 60;
	REDIPS.dialog.fade_speed = 18;
	//REDIPS.dialog.close_button = 'Z';
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
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}