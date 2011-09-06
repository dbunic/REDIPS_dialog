/*
Copyright (c)  2008-2011, www.redips.net  All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/dialog-box/
Version 1.5.1
See 06, 2011.
*/

/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false */

/* enable strict mode */
"use strict";

// create REDIPS namespace (if is not already defined in another REDIPS package)
var REDIPS = REDIPS || {};

REDIPS.dialog = (function () {
		// function declaration
	var	init,
		show,
		hide,
		image_tag,		// prepare image tag
		iframe_tag,		// prepare iframe tag
		position,
		visibility,
		fade,
		input_html,		// function prepares input tag HTML 
		
		// properties
		op_high = 60,	// highest opacity level
		op_low = 0,		// lowest opacity level (should be the same as initial opacity in the CSS)
		fade_speed = 10,// set default speed - 10ms
		close_button = '✕',
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
		dialog_id = 'REDIPS_dialog';	// set dialog id (the same id should be in redips-dialog.css) 


	// initialization
	init = function () {
		// create dialog box
		dialog_box = document.createElement('div');
		dialog_box.setAttribute('id', dialog_id);
		// create shade div
		shade = document.createElement('div');
		shade.setAttribute('id', 'REDIPS_shade');
		// append dialog box and shade to the page body
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(shade);
		body.appendChild(dialog_box);
		// add event listener for onscroll & onresize events
		REDIPS.event.add(window, 'resize', position);
		REDIPS.event.add(window, 'scroll', position);
	};


	// show dialog box
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
		// set dialog width, height and calculate central position
		dialog_width  = width;
		dialog_height = height;
		position();
		// if text ends with jpg, jpeg, gif or png, then prepare img tag
		img_extensions = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
		// if text contains .php, .html, then prepare iframe tag
		page_extensions = /(\.php|\.html)/i;
		// if text contains youtube url
		youtube_url = /www\.youtube\.com/i;
		// if text is image		
		if (img_extensions.test(text)) {
			// text can precede jpg, jpeg, gif or png image, so search for separator
			img_text = text.split('|');
			// separator doesn't exist, display only image without text
			if (img_text.length === 1) {
				div_img = image_tag(img_text[0]);
			}
			// otherwise, prepare image and text DIV
			else {
				div_img = image_tag(img_text[1]);
				div_text = '<DIV>' + img_text[0] + '</DIV>';
			}
		}
		// prepare iframe HTML code
		else if (page_extensions.test(text)) {
			div_img = iframe_tag(text);
		}
		// prepare youtube HTML code
		else if (youtube_url.test(text)) {
			youtube_html = REDIPS.dialog.youtube.replace(/_youtube_/g, text);
		}
		// else prepare text within DIV
		else {
			div_text = '<DIV>' + text + '</DIV>';
		}
		// prepare optional button1
		if (button1 !== undefined) {
			input1 = input_html(button1);
		}
		// prepare optional button2 
		if (button2 !== undefined) {
			input2  = input_html(button2);
		}
		// set HTML for dialog box - use table to vertical align content inside
		// dialog box (this should work in all browsers)
		dialog_box.innerHTML = '<DIV class="REDIPS_titlebar"><SPAN title="Close" onclick="REDIPS.dialog.hide(\'undefined\')">' + REDIPS.dialog.close_button + '</SPAN></DIV>' +
								'<TABLE class="REDIPS_table" cellpadding="0" cellspacing="0"><TR><TD valign="center" height="' + height + '" width="' + width + '">' + 
								 div_img +
								 div_text +
								 youtube_html +
								 '<DIV>' + input1 + input2 + '</DIV>' +
								 '</TD></TR></TABLE>';
		// show shade and dialog box
		shade.style.display = dialog_box.style.display = 'block';
		// hide dropdown menus, iframes & flash
		visibility('hidden');
		// show shaded div slowly
		fade(REDIPS.dialog.op_low, 5);
	};


	// hide dialog box and shade
	hide = function (fnc, param) {
		// set function call
		function_call = fnc;
		// set function parameter
		function_param = param;
		// start fade out
		fade(REDIPS.dialog.op_high, -10);
		// hide dialog box
		dialog_box.style.display = 'none';
		// show dropdown menu, iframe & flash
		visibility('visible');
	};


	// function prepares input tag HTML based on "Yes|button2|hello" syntax
	input_html = function (button) {
		var param,	// optional parameter for function hide
			html;	// input tag HTML
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
		html = '<input type="button" onclick="REDIPS.dialog.hide(\'' + button[1] + param + '\');" value="' + button[0] + '"/>';
		// return result
		return html;
	};


	// prepare img tags (one or more) 
	image_tag = function (image) {
		var img,	// prepared img HTML
			images,	// array containing separated images
			i;		// variable used in loop
		// split input image parameter separated with ,
		images = image.split(',');
		// array contain only one image - simple
		if (images.length === 1) {
			img = '<DIV class="REDIPS_imgc"><IMG src="' + images[0] + '" height="' + (dialog_height - 40) + '"/></DIV>';
		}
		// otherwise run loop for more images (images are placed in a table row)
		else {
			img = '<DIV class="REDIPS_imgc" style="width:' + (dialog_width - 8) + 'px"><TABLE><TR>';
			for (i = 0; i < images.length; i++) {
				img += '<TD><IMG src="' + images[i] + '" height="' + (dialog_height - 40) + '"/></TD>';
			}
			img += '</TR></TABLE></DIV>';
		}
		// return prepared img HTML
		return img; 
	};


	// function prepares iframe HTML
	iframe_tag = function (url) {
		// define iframe variable
		var iframe;
		// prepare iframe html
		iframe = '<iframe src="' + url + '" width="100%" height="100%" frameborder="0"></iframe>';
		// return iframe HTML
		return iframe;
	};


	// function sets dialog position to the center and maximize shade div
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


	// show/hide dropdown menu, iframe and flash objects (work-around for dropdown menu problem in IE6)
	visibility = function (p) {
		var obj = [],	// define tag array
			x, y,		// variables used in local loops
			e;			// current element
		obj[0] = document.getElementsByTagName('select');
		obj[1] = document.getElementsByTagName('iframe');
		obj[2] = document.getElementsByTagName('object');
		// loop through fetched elements
		for (x = 0; x < obj.length; x++) {
			for (y = 0; y < obj[x].length; y++) {
				// set current element
				e = obj[x][y];
				// loop up until found main div container
				while (e && e.id !== dialog_id) {
					e = e.parentNode;
				}
				// if object belongs to the DIV REDIPS_dialog then step over
				if (e && e.id === dialog_id) {
					continue;
				}
				obj[x][y].style.visibility = p;
			}
		}
	};


	// shade fade in / fade out
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


	return {
		// public properties
		op_high			: op_high,		// highest opacity level
		op_low			: op_low,		// lowest opacity level (should be the same as initial opacity in the CSS)
		fade_speed		: fade_speed,	// fade speed (default is 18ms)
		youtube			: youtube,		// youtube HTML code
		close_button	: close_button,	// close button (1 character default ✕)

		// public methods
		init			: init,			// initialization
		show			: show,			// show dialog box
		hide			: hide			// hide dialog box
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