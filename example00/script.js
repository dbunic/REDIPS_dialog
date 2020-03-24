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
	// opacitiy
	rd.opHigh = 60;
	// fade speed
	rd.fadeSpeed = 18;
	// define close button
	// rd.close_button = 'Z';
	// event handler called after dialog is displayed
	rd.event.displayed = function () {
		redips.displayMessage('Dialog displayed');
	};
	// event handler called after dialog is closed
	rd.event.closed = function () {
		redips.displayMessage('Dialog closed');
	};
};


// method displays message (and clears after timeout)
redips.displayMessage = function (message) {
	// set reference to the message element
	let msg = document.getElementById('message');
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
