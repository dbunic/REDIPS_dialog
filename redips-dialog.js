/*
Copyright (c)  2008-2011, www.redips.net  All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/dialog-box/
Version 1.7.0
Aug 1, 2012.
*/

/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, ActiveXObject: false */

/* enable strict mode */
"use strict";

// create REDIPS namespace (if is not already defined in another REDIPS package)
var REDIPS = REDIPS || {};


/**
 * @namespace
 * @description REDIPS.dialog is a simple JavaScript dialog box.
 * @name REDIPS.dialog
 * @author Darko Bunic
 * @see
 * <a href="http://www.redips.net/javascript/dialog-box/">JavaScript dialog box</a>
 * @version 1.7.0
 */
REDIPS.dialog = (function () {
		// function declaration
	var	init,
		show,
		hide,
		image_tag,			// prepare image tag
		position,
		fade,
		input_html,			// function prepares input tag HTML
		html,				// function sets custom HTML to display in dialog box
		dialog_html,		// prepares dialog html
		initXMLHttpClient,
		normalize,			// private method returns normalized spaces from input string
		
		// properties
		request,			// XMLHttp request object (needed for HTML tag)
		op_high = 60,		// highest opacity level
		op_low = 0,			// lowest opacity level (should be the same as initial opacity in the CSS)
		fade_speed = 10,	// set default speed - 10ms
		shown = false,		// (boolean) readonly public property which shows if dialog is displayed or not
		close_button = '✕',	// (string) define close button
		custom_html,		// custom HTML to display inside dialog box (custom_html is set in REDIPS.drag.html method)
		// youtube HTML code (this can be overwritten with REDIPS.dialog.youtube - "_youtube_" must be present)
		youtube =	'<object width="640" height="390">' +
						'<param name="movie" value="http://_youtube_?&version=2&fs=0&rel=0&iv_load_policy=3&color2=0x6A93D4"></param>' +
						'<param name="allowFullScreen" value="true"></param>' +
						'<param name="allowScriptAccess" value="always"></param>' +
						'<embed src="http://_youtube_?&version=2&fs=0&rel=0&iv_load_policy=3&color2=0x6A93D4" ' +
								'type="application/x-shockwave-flash" ' +
								'allowfullscreen="true" ' +
								'allowscriptaccess="always" ' +
								'width="640" height="390">' +
						'</embed>' +
					'</object>',
		
		// private parameters
		shade,							// shade div (object reference)
		dialog_box,						// dialog box (object reference)
		dialog_width = 0,				// initialize dialog width
		dialog_height = 0,				// initialize dialog height
		function_call,					// name of function to call after clicking on button
		function_param,					// optional function parameter
		dialog_id = 'redips_dialog';	// set dialog id (the same id should be in redips-dialog.css) 


	/**
	 * Dialog box initialization.
	 * It should be called at least once before execution of REDIPS.dialog.show() method.
	 * @public
	 * @function
	 * @name REDIPS.dialog#init
	 */
	init = function () {
		// create dialog box
		dialog_box = document.createElement('div');
		dialog_box.setAttribute('id', dialog_id);
		// create DIV element to pass custom HTML (displayed in dialog box)
		custom_html = document.createElement('div');
		// create shade div
		shade = document.createElement('div');
		shade.setAttribute('id', 'redips_dialog_shade');
		// append dialog box and shade to the page body
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(shade);
		body.appendChild(dialog_box);
		// add event listener for onscroll & onresize events
		REDIPS.event.add(window, 'resize', position);
		REDIPS.event.add(window, 'scroll', position);
		// initiate XMLHttp request object
		request = initXMLHttpClient();
	};


	/**
	 * XMLHttp request object initialization.
	 * @return {Object} Returns XMLHttpRequest object.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	// XMLHttp request object
	initXMLHttpClient = function () {
		var XMLHTTP_IDS,
			xmlhttp,
			success = false,
			i;
		// Mozilla/Chrome/Safari/IE7/IE8 (normal browsers)
		try {
			xmlhttp = new XMLHttpRequest(); 
		}
		// IE (?!)
		catch (e1) {
			XMLHTTP_IDS = [ 'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
							'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP' ];
			for (i = 0; i < XMLHTTP_IDS.length && !success; i++) {
				try {
					success = true;
					xmlhttp = new ActiveXObject(XMLHTTP_IDS[i]);
				}
				catch (e2) {}
			}
			if (!success) {
				throw new Error('Unable to create XMLHttpRequest!');
			}
		}
		return xmlhttp;
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
		var input1 = '',		// define input1 button
			input2 = '',		// define input2 (optional) button
			param  = '',		// optional function parameter
			img_extensions,		// needed for images search
			page_extensions,	// needed for pages search
			youtube_url,		// needed for youtube url search
			youtube_html = '',	// youtube embeded html
			div_img = '',		// prepared DIV with images
			div_text = '',		// text wrapped with DIV
			img_text = '';		// text under image

		// set shown property to true
		REDIPS.dialog.shown = true;
		// set dialog width, height and calculate central position
		dialog_width  = width;
		dialog_height = height;
		position();
		// if text ends with jpg, jpeg, gif or png, then prepare img tag
		img_extensions = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
		// if text contains .php, .html, .aspx then page will be fetched via AJAX
		page_extensions = /(\.php|\.html|\.aspx)/i;
		// if text contains youtube url
		youtube_url = /www\.youtube\.com/i;
		// prepare optional button1
		if (button1 !== undefined) {
			input1 = input_html(button1);
		}
		// prepare optional button2 
		if (button2 !== undefined) {
			input2  = input_html(button2);
		}
		// if input text is 'html' then it be considered as input parameter and HTML from REDIPS.dialog.html object will be used
		if (text === 'html') {
			dialog_html(custom_html.innerHTML, input1, input2);
		}
		// if text is image		
		else if (img_extensions.test(text)) {
			// text can precede jpg, jpeg, gif or png image, so search for separator
			img_text = text.split('|');
			// separator doesn't exist, display only image without text
			if (img_text.length === 1) {
				div_img = image_tag(img_text[0]);
			}
			// otherwise, prepare image and text DIV
			else {
				div_img = image_tag(img_text[1]);
				div_text = '<div>' + img_text[0] + '</div>';
			}
			dialog_html(div_img + div_text, input1, input2);
		}
		// get html with AJAX from server
		else if (page_extensions.test(text)) {
			// open asynchronus request
			request.open('GET', text, true);
			// the onreadystatechange event is triggered every time the readyState changes
			request.onreadystatechange = function () {
				// request finished and response is ready
				if (request.readyState === 4) {
					if (request.status === 200) {
						dialog_html(request.responseText);
					}
					// if request status is not OK then display error in dialog
					else {
						dialog_html('Error: [' + request.status + '] ' + request.statusText);
					}
			    }
			};
			// send request
			request.send(null);
		}
		// prepare youtube HTML code
		else if (youtube_url.test(text)) {
			youtube_html = REDIPS.dialog.youtube.replace(/_youtube_/g, text);
			dialog_html(youtube_html);
		}
		// else prepare text within DIV
		else {
			div_text = '<div>' + text + '</div>';
			dialog_html(div_img + div_text, input1, input2);
		}
		// call event handler
		REDIPS.dialog.myhandler_displayed();
	};


	/**
	 * Method sets innerHTML for displaying text, images, youtube videos or custom HTML inside dialog box.
	 * "html" parameter is mandatory while input1 and input2 are optional and they will be mostly used
	 * for displaying text (questions).
	 * @param {String} html_dialog HTML code to display in dialog box.
	 * @param {String} [input1] First button.
	 * @param {String} [input2] Second button.
	 * @private
	 * @memberOf REDIPS.drag#
	 */
	dialog_html = function (html_dialog, input1, input2) {
		// if buttons are not defined, set blank string to enable string concatenation
		if (input1 === undefined) {
			input1 = '';
		}
		if (input2 === undefined) {
			input2 = '';
		}
		// set HTML for dialog box - use table to vertical align content inside
		// dialog box (this should work in all browsers)
		dialog_box.innerHTML = '<div class="redips_dialog_titlebar"><span title="Close" onclick="REDIPS.dialog.hide(\'undefined\')">' + REDIPS.dialog.close_button + '</span></div>' +
								'<table class="redips_dialog_tbl" cellpadding="0" cellspacing="0"><tr><td valign="center" height="' + dialog_height + '" width="' + dialog_width + '">' +
								 html_dialog +
								 '<div class="redips_dialog_buttons">' + input1 + input2 + '</div>' +
								 '</td></tr></table>';
		// show shade and dialog box
		shade.style.display = dialog_box.style.display = 'block';
		// show shaded div slowly
		fade(REDIPS.dialog.op_low, 5);
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
			function_call = fnc;
			// set function parameter
			function_param = param;
			// start fade out
			fade(REDIPS.dialog.op_high, -10);
			// hide dialog box
			dialog_box.style.display = 'none';
			// call event handler after dialog is hidden (or better say closed)
			REDIPS.dialog.myhandler_closed();
		}
	};


	/**
	 * Method prepares input tag HTML based on "Yes|button2|hello" syntax. 
	 * @param {String} button Input string in a form "Yes|button2|hello".
	 * @return {String} Returns HTML of "input" button with prepared REDIPS.dialog.hide() call. This HTML will be used to display buttons in dialog box.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	input_html = function (button) {
		var param,		// optional parameter for function hide
			input_tag;	// input tag HTML
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
		input_tag = '<input type="button" onclick="REDIPS.dialog.hide(\'' + normalize(button[1]) + normalize(param) + '\');" value="' + normalize(button[0]) + '"/>';
		// return result
		return input_tag;
	};


	/**
	 * If text parameter in REDIPS.dialog.show() method contains image (.jpg .jpeg .gif .png) then this method will prepare complete HTML (image wrapped inside DIV element).
	 * @param {String} image Image to display (it is text like "my_image.jpg).
	 * @return {String} Returns HTML for image prepared to display in dialog box.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	image_tag = function (image) {
		var img,	// prepared img HTML
			images,	// array containing separated images
			i;		// variable used in loop
		// split input image parameter separated with ,
		images = image.split(',');
		// array contain only one image - simple
		if (images.length === 1) {
			img = '<div class="redips_dialog_imgc"><img src="' + images[0] + '" height="' + (dialog_height - 40) + '"/></div>';
		}
		// otherwise run loop for more images (images are placed in a table row)
		else {
			img = '<div class="redips_dialog_imgc" style="width:' + (dialog_width - 8) + 'px"><table><tr>';
			for (i = 0; i < images.length; i++) {
				img += '<td><img src="' + images[i] + '" height="' + (dialog_height - 40) + '"/></td>';
			}
			img += '</tr></table></div>';
		}
		// return prepared img HTML
		return img; 
	};


	/**
	 * Method sets HTML to the custom_html object.
	 * Content of "custom_html" will be used if REDIPS.dialog.show() method will have "html" as string parameter.
	 * @param {String} my_html Custom HTML to show in dialog box.
	 * @see <a href="#show">show</a>
	 * @public
	 * @function
	 * @name REDIPS.dialog#html
	 */
	html = function (my_html) {
		custom_html.innerHTML = my_html;
	};


	/**
	 * Method sets dialog position to the center and maximize shade div.
	 * @private
	 * @memberOf REDIPS.dialog#
	 */
	position = function () {
		// define local variables
		var window_width, window_height, scrollX, scrollY;
		// Non-IE (Netscape compliant)
		if (typeof(window.innerWidth) === 'number') {
			window_width  = window.innerWidth;
			window_height = window.innerHeight;
			scrollX = window.pageXOffset;
			scrollY = window.pageYOffset;
		}
		// IE 6 standards compliant mode
		else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			window_width  = document.documentElement.clientWidth;
			window_height = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft;
			scrollY = document.documentElement.scrollTop;
			// IE hack because #shade{width:100%;height:100%;} will not work for IE if body{height:100%} isn't set also ?!
			shade.style.width   = window_width  + 'px';
			shade.style.height  = window_height + 'px';
		}
		// DOM compliant
		else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
			window_width  = document.body.clientWidth;
			window_height = document.body.clientHeight;
			scrollX = document.body.scrollLeft;
			scrollY = document.body.scrollTop;
		}
		// place dialog box to the center (dialog box has "position: fixed" so scrollX & scrollY are not needed for calculation)
		dialog_box.style.left = ((window_width  - dialog_width)  / 2) + 'px';
		dialog_box.style.top  = ((window_height - dialog_height) / 2) + 'px';

		// set shade offset
		shade.style.top  = scrollY + 'px';
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
		shade.style.filter  = 'alpha(opacity=' + opacity + ')';
		// update opacity level
		opacity += step;
		// recursive call if opacity is between 'low' and 'high' values
		if (REDIPS.dialog.op_low <= opacity && opacity <= REDIPS.dialog.op_high) {
			setTimeout(
				function () {
					fade(opacity, step);
				}, REDIPS.dialog.fade_speed); // fade speed is public parameter
		}
		// hide shade div when fade out ends and make function call 
		else if (REDIPS.dialog.op_low > opacity) {
			shade.style.display = 'none';
			if (function_call !== 'undefined') {
				// call function after button is clicked because functions are defined in global scope
				window[function_call](function_param);
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
		op_high			: op_high,		// highest opacity level
		op_low			: op_low,		// lowest opacity level (should be the same as initial opacity in the CSS)
		fade_speed		: fade_speed,	// fade speed (default is 18ms)
		youtube			: youtube,		// youtube HTML code
		shown			: shown,		// (boolean) readonly public property which shows if dialog is displayed or not
		close_button	: close_button,	// close button (1 character default ✕)

		// public methods
		init			: init,			// initialization
		show			: show,			// show dialog box
		hide			: hide,			// hide dialog box
		html			: html,			// define custom HTML

		// event handlers
		/**
		 * Event handler invoked after dialog is displayed on the page.
		 * @name REDIPS.drag#myhandler_displayed
		 * @function
		 * @event
		 */
		myhandler_displayed : function () {},
		/**
		 * Event handler invoked after dialog is closed.
		 * @name REDIPS.drag#myhandler_closed
		 * @function
		 * @event
		 */	
		myhandler_closed : function () {}
	};

}());




//if REDIPS.event isn't already defined (from other REDIPS file) 
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
			add		: add,
			remove	: remove
		}; // end of public (return statement)	
		
	}());
}
