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
	// opacitiy
	rd.op_high = 60;
	// fade speed
	rd.fade_speed = 18;
	// define close button
	//rd.close_button = 'Z';
	// event handler called after dialog is displayed
	rd.myhandler_displayed = function () {
		redips.display_message('Dialog displayed');
	};
	// event handler called after dialog is closed
	rd.myhandler_closed = function () {
		redips.display_message('Dialog closed');
	};
};


// method displays message (and clears after timeout)
redips.display_message = function (message) {
	// set reference to the message element
	var msg = document.getElementById('message');
	// display message
	msg.innerHTML = message;
	// clear message after timeout (1.5sec)
	setTimeout(function () {
		msg.innerHTML = '';
	}, 1500);
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}