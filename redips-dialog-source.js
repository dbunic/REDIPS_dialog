/*
Copyright (c)  2008-2020, www.redips.net  All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/dialog-box/
Version 1.8.0
Mar 24, 2020.
*/

/* eslint-env browser */
/* eslint
   semi: ["error", "always"],
   indent: [2, "tab"],
   no-tabs: 0,
   no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
   one-var: ["error", "always"] */

/* enable strict mode */
'use strict';

/**
 * @name REDIPS
 * @description create REDIPS namespace (if is not already defined in another REDIPS package)
 */
var REDIPS = REDIPS || {}; // eslint-disable-line no-use-before-define

/**
 * @namespace
 * @description REDIPS.dialog is a simple JavaScript dialog box.
 * @name REDIPS.dialog
 * @author Darko Bunic
 * @see
 * <a href="http://www.redips.net/javascript/dialog-box/">JavaScript dialog box</a>
 * @version 1.8.0
 */
REDIPS.dialog = (function () {
	// function declaration
	var	init,
		show,
		hide,
		imageTag,			// prepare image tag
		position,
		fade,
		inputHtml,			// method prepares input tag HTML
		html,				// method sets custom HTML to display in dialog box
		dialogHtml,			// prepares dialog html
		normalize,			// private method returns normalized spaces from input string
		// properties
		xhr,				// XMLHttpRequest object
		opHigh = 60,		// highest opacity level
		opLow = 0,			// lowest opacity level (should be the same as initial opacity in the CSS)
		fadeSpeed = 10,		// set default speed - 10ms
		shown = false,		// (boolean) readonly public property which shows if dialog is displayed or not
		closeButton = '✕',	// (string) define close button
		customHtml,			// custom HTML to display inside dialog box (customHtml is set in REDIPS.drag.html method)
		// youtube HTML code (this can be overwritten with REDIPS.dialog.youtube - "_youtubeId_" must be present)
		youtube = '<iframe width="640" height="390" src="https://www.youtube.com/embed/_youtubeId_" frameborder="0" allowfullscreen></iframe>',

		// private parameters
		shade,							// shade div (object reference)
		dialogBox,						// dialog box (object reference)
		dialogWidth = 0,				// initialize dialog width
		dialogHeight = 0,				// initialize dialog height
		functionCall,					// name of function to call after clicking on button
		functionParam,					// optional function parameter
		dialogId = 'redips-dialog',		// set dialog id (the same id should be in redips-dialog.css)
		// (object) event handlers
		event = {displayed: function () {},
			closed: function () {}};

	/**
	 * Dialog box initialization.
	 * It should be called at least once before execution of REDIPS.dialog.show() method.
	 * @public
	 * @function
	 * @name REDIPS.dialog#init
	 */
	init = function () {
		// create dialog box
		dialogBox = document.createElement('div');
		dialogBox.setAttribute('id', dialogId);
		// create DIV element to pass custom HTML (displayed in dialog box)
		customHtml = document.createElement('div');
		// create shade div
		shade = document.createElement('div');
		shade.setAttribute('id', 'redips-dialog-shade');
		// append dialog box and shade to the page body
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(shade);
		body.appendChild(dialogBox);
		// add event listener for onscroll & onresize events
		REDIPS.event.add(window, 'resize', position);
		REDIPS.event.add(window, 'scroll', position);
		// initiate XML Http request object
		xhr = new XMLHttpRequest();
	};


	/**
	 * Show dialog box. Method will shade page background and display dialog box.
	 * @param {Integer} width Dialog box width.
	 * @param {Integer} height Dialog box height.
	 * @param {String} text It can contain text, image, page (.php .html .aspx) and 'html' as parameter.
	 * @param {String} [button1] Define first button.
	 * @param {String} [button2] Define second button.
	 * @see <a href="#hide">hide</a>
	 * @public
	 * @function
	 * @name REDIPS.dialog#show
	 */
	show = function (width, height, text, button1, button2) {
		let input1 = '',		// define input1 button
			input2 = '',		// define input2 (optional) button
			imgExtensions,		// needed for images search
			pageExtensions,		// needed for pages search
			youtubeUrl,			// needed for youtube url search
			youtubeHtml = '',	// youtube embeded html
			divImg = '',		// prepared DIV with images
			divText = '',		// text wrapped with DIV
			imgText = '';		// text under image

		// set shown property to true
		REDIPS.dialog.shown = true;
		// set dialog width, height and calculate central position
		dialogWidth = width;
		dialogHeight = height;
		position();
		// if text ends with jpg, jpeg, gif or png, then prepare img tag
		imgExtensions = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
		// if text contains .php, .html, .aspx then page will be fetched via AJAX
		pageExtensions = /(\.php|\.html|\.aspx)/i;
		// if text contains youtube:id
		youtubeUrl = /youtube:/i;
		// prepare optional button1
		if (button1 !== undefined) {
			input1 = inputHtml(button1);
		}
		// prepare optional button2
		if (button2 !== undefined) {
			input2 = inputHtml(button2);
		}
		// if input text is 'html' then it be considered as input parameter and HTML from REDIPS.dialog.html object will be used
		if (text === 'html') {
			dialogHtml(customHtml.innerHTML, input1, input2);
		}
		// if text is image
		else if (imgExtensions.test(text)) {
			// text can precede jpg, jpeg, gif or png image, so search for separator
			imgText = text.split('|');
			// separator doesn't exist, display only image without text
			if (imgText.length === 1) {
				divImg = imageTag(imgText[0]);
			}
			// otherwise, prepare image and text DIV
			else {
				divImg = imageTag(imgText[1]);
				divText = '<div>' + imgText[0] + '</div>';
			}
			dialogHtml(divImg + divText, input1, input2);
		}
		// get content with AJAX from server
		else if (pageExtensions.test(text)) {
			// open asynchronus request
			xhr.open('GET', text, true);
			// set callback handler
			xhr.onreadystatechange = function () {
				// if operation is completed (readyState === 4)
				if (xhr.readyState === XMLHttpRequest.DONE) {
					// if the HTTP status is OK
					if (xhr.status === 200) {
						dialogHtml(xhr.responseText);
					}
					// if request status is not OK then display error in dialog
					else {
						dialogHtml('Error: [' + xhr.status + '] ' + xhr.statusText);
					}
				}
			};
			// in a good manners, set 'X-Requested-With' HTTP header
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			// send request
			xhr.send(null);
		}
		// prepare youtube HTML code (text is in format 'youtube:12345678')
		else if (youtubeUrl.test(text)) {
			// get youtube id
			let id = text.split(':')[1];
			// replace 'youtube' property with id
			youtubeHtml = REDIPS.dialog.youtube.replace(/_youtubeId_/g, id);
			// display HTML
			dialogHtml(youtubeHtml);
		}
		// else prepare text within DIV
		else {
			divText = '<div>' + text + '</div>';
			dialogHtml(divImg + divText, input1, input2);
		}
		// call event handler
		REDIPS.dialog.event.displayed();
	};


	/**
	 * Method sets innerHTML for displaying text, images, youtube videos or custom HTML inside dialog box.
	 * "html" parameter is mandatory while input1 and input2 are optional and they will be mostly used
	 * for displaying text (questions).
	 * @param {String} htmlDialog HTML code to display in dialog box.
	 * @param {String} [input1] First button.
	 * @param {String} [input2] Second button.
	 * @private
	 * @memberOf REDIPS.drag#
	 */
	dialogHtml = function (htmlDialog, input1, input2) {
		// if buttons are not defined, set blank string to enable string concatenation
		if (input1 === undefined) {
			input1 = '';
		}
		if (input2 === undefined) {
			input2 = '';
		}
		// set HTML for dialog box - use table to vertical align content inside
		// dialog box (this should work in all browsers)
		dialogBox.innerHTML =
			'<div class="redips-dialog-titlebar"><span title="Close" onclick="REDIPS.dialog.hide(\'undefined\')">' + REDIPS.dialog.closeButton + '</span></div>' +
			'<table class="redips-dialog-tbl" cellpadding="0" cellspacing="0"><tr><td valign="center" height="' + dialogHeight + '" width="' + dialogWidth + '">' +
			htmlDialog +
			'<div class="redips-dialog-buttons">' + input1 + input2 + '</div>' +
			'</td></tr></table>';
		// show shade and dialog box
		shade.style.display = dialogBox.style.display = 'block';
		// show shaded div slowly
		fade(REDIPS.dialog.opLow, 5);
	};


	/**
	 * Hide dialog box and remove shade (fade out page).
	 * @param {String} fnc Set function call on dialog box hide. If function is not needed then input parameter should be string "undefined".
	 * @param {String} [param] Set parameter to send to the function.
	 * @public
	 * @function
	 * @name REDIPS.dialog#hide
	 */
	hide = function (fnc, param) {
		// test if dialog is displayed
		if (REDIPS.dialog.shown === true) {
			// set shown property to false
			REDIPS.dialog.shown = false;
			// set function call
			functionCall = fnc;
			// set function parameter
			functionParam = param;
			// start fade out
			fade(REDIPS.dialog.opHigh, -10);
			// hide dialog box
			dialogBox.style.display = 'none';
			// clear HTML
			dialogBox.innerHTML = '';
			// call event handler after dialog is hidden (or better say closed)
			REDIPS.dialog.event.closed();
		}
	};


	/**
	 * Method prepares input tag HTML based on "Yes|button2|hello" syntax.
	 * @param {String} button Input string in a form "Yes|button2|hello".
	 * @return {String} Returns HTML of "input" button with prepared REDIPS.dialog.hide() call. This HTML will be used to display buttons in dialog box.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	inputHtml = function (button) {
		let param,		// optional parameter for function hide
			inputTag;	// input tag HTML
		// split button values
		button = button.split('|');
		// define parameter (this is last value in composed string)
		param = button[2];
		// prepare optional function parameter
		if (param !== undefined) {
			param = '\',\'' + param;
		}
		else {
			param = '';
		}
		// prepare input tag HTML
		inputTag = '<input type="button" onclick="REDIPS.dialog.hide(\'' + normalize(button[1]) + normalize(param) + '\');" value="' + normalize(button[0]) + '"/>';
		// return result
		return inputTag;
	};


	/**
	 * If text parameter in REDIPS.dialog.show() method contains image (.jpg .jpeg .gif .png) then this method will prepare complete HTML (image wrapped inside DIV element).
	 * @param {String} image Image to display (it is text like "my_image.jpg).
	 * @return {String} Returns HTML for image prepared to display in dialog box.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	imageTag = function (image) {
		let img,	// prepared img HTML
			images,	// array containing separated images
			i;		// variable used in loop
		// split input image parameter separated with ,
		images = image.split(',');
		// array contain only one image - simple
		if (images.length === 1) {
			img = '<div class="redips-dialog-imgc"><img src="' + images[0] + '" height="' + (dialogHeight - 40) + '"/></div>';
		}
		// otherwise run loop for more images (images are placed in a table row)
		else {
			img = '<div class="redips-dialog-imgc" style="width:' + (dialogWidth - 8) + 'px"><table><tr>';
			for (i = 0; i < images.length; i++) {
				img += '<td><img src="' + images[i] + '" height="' + (dialogHeight - 40) + '"/></td>';
			}
			img += '</tr></table></div>';
		}
		// return prepared img HTML
		return img;
	};


	/**
	 * Method sets HTML to the customHtml object.
	 * Content of "customHtml" will be used if REDIPS.dialog.show() method will have "html" as string parameter.
	 * @param {String} my_html Custom HTML to show in dialog box.
	 * @see <a href="#show">show</a>
	 * @public
	 * @function
	 * @name REDIPS.dialog#html
	 */
	html = function (myHTML) {
		customHtml.innerHTML = myHTML;
	};


	/**
	 * Method sets dialog position to the center and maximize shade div.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	position = function () {
		// define local variables
		let windowWidth,
			windowHeight,
			scrollX,
			scrollY;
		// Non-IE (Netscape compliant)
		if (typeof (window.innerWidth) === 'number') {
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
			scrollX = window.pageXOffset;
			scrollY = window.pageYOffset;
		}
		// IE 6 standards compliant mode
		else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft;
			scrollY = document.documentElement.scrollTop;
			// IE hack because #shade{width:100%;height:100%;} will not work for IE if body{height:100%} isn't set also ?!
			shade.style.width = windowWidth + 'px';
			shade.style.height = windowHeight + 'px';
		}
		// DOM compliant
		else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
			scrollX = document.body.scrollLeft;
			scrollY = document.body.scrollTop;
		}
		// place dialog box to the center (dialog box has "position: fixed" so scrollX & scrollY are not needed for calculation)
		dialogBox.style.left = ((windowWidth - dialogWidth) / 2) + 'px';
		dialogBox.style.top = ((windowHeight - dialogHeight) / 2) + 'px';

		// set shade offset
		shade.style.top = scrollY + 'px';
		shade.style.left = scrollX + 'px';
	};


	/**
	 * Method fades in / fades out page background.
	 * If step is negative then method will fade out otherwise it will fade in (shade) page background.
	 * @param {Integer} opacity Defines opacity level for fade in / fade out.
	 * @param {Integer} step Defines step for fade in / fade out process. Step can be positive or negative.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	fade = function (opacity, step) {
		// set opacity for FF and IE
		shade.style.opacity = opacity / 100;
		shade.style.filter = 'alpha(opacity=' + opacity + ')';
		// update opacity level
		opacity += step;
		// recursive call if opacity is between 'low' and 'high' values
		if (REDIPS.dialog.opLow <= opacity && opacity <= REDIPS.dialog.opHigh) {
			setTimeout(
				function () {
					fade(opacity, step);
				}, REDIPS.dialog.fadeSpeed); // fade speed is public parameter
		}
		// hide shade div when fade out ends and make function call
		else if (REDIPS.dialog.opLow > opacity) {
			shade.style.display = 'none';
			if (functionCall !== 'undefined') {
				// call function after button is clicked because functions are defined in global scope
				window[functionCall](functionParam);
			}
		}
	};


	/**
	 * Method returns a string in which all of the preceding and trailing white space has been
	 * removed, and in which all internal sequences of white is replaced with one white space.
	 * @param {String} str Input string.
	 * @return {String} Returns normalized string.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	normalize = function (str) {
		if (str !== undefined) {
			str = str.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
		}
		// return normalized string (without preceding and trailing spaces)
		return str;
	};


	return {
		// public properties
		opHigh: opHigh,			// highest opacity level
		opLow: opLow,			// lowest opacity level (should be the same as initial opacity in the CSS)
		fadeSpeed: fadeSpeed,	// fade speed (default is 18ms)
		youtube: youtube,		// youtube HTML code
		shown: shown,			// (boolean) readonly public property which shows if dialog is displayed or not
		closeButton: closeButton,	// close button (1 character default ✕)

		// public methods
		init: init, // initialization
		show: show, // show dialog box
		hide: hide, // hide dialog box
		html: html, // define custom HTML

		/* Event Handlers */
		/**
		 * All events are part of REDIPS.dialog.event namespace.
		 * @type Object
		 * @ignore
		 */
		event: event
		/* Event Handlers */
		/**
		 * Event handler invoked after dialog is displayed on page.
		 * @param {HTMLElement} [currentCell] Reference to the table cell of clicked element.
		 * @name REDIPS.dialog#event:event::displayed
		 * @function
		 * @event
		 */
		/**
		 * Event handler invoked after dialog is closed.
		 * @name REDIPS.dialog#event:event::closed
		 * @function
		 * @event
		 */
	};
}());


// if REDIPS.event isn't already defined (from other REDIPS file)
if (!REDIPS.event) {
	REDIPS.event = (function () {
		var add,	// add event listener
			remove;	// remove event listener

		// http://msdn.microsoft.com/en-us/scriptjunkie/ff728624
		// http://www.javascriptrules.com/2009/07/22/cross-browser-event-listener-with-design-patterns/

		// add event listener
		add = function (obj, eventName, handler) {
			if (obj.addEventListener) {
				obj.addEventListener(eventName, handler, false);
			}
			else if (obj.attachEvent) {
				obj.attachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = handler;
			}
		};

		// remove event listener
		remove = function (obj, eventName, handler) {
			if (obj.removeEventListener) {
				obj.removeEventListener(eventName, handler, false);
			}
			else if (obj.detachEvent) {
				obj.detachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = null;
			}
		};

		return {
			add: add,
			remove: remove
		}; // end of public (return statement)
	}());
}
