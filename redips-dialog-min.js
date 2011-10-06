/*
Copyright (c) 2008-2011, www.redips.net  All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/dialog-box/
Version 1.5.3
Oct 5, 2011.
*/
"use strict";var REDIPS=REDIPS||{};REDIPS.dialog=(function(){var init,show,hide,image_tag,position,fade,input_html,dialog_html,initXMLHttpClient,request,op_high=60,op_low=0,fade_speed=10,close_button='✕',youtube='<object width="640" height="390">'+'<param name="movie" value="http://_youtube_?&version=2&fs=0&rel=0&iv_load_policy=3&color2=0x6A93D4"></param>'+'<param name="allowFullScreen" value="true"></param>'+'<param name="allowScriptAccess" value="always"></param>'+'<embed src="http://_youtube_?&version=2&fs=0&rel=0&iv_load_policy=3&color2=0x6A93D4" '+'type="application/x-shockwave-flash" '+'allowfullscreen="true" '+'allowscriptaccess="always" '+'width="640" height="390">'+'</embed>'+'</object>',shade,dialog_box,dialog_width=0,dialog_height=0,function_call,function_param,dialog_id='redips_dialog';init=function(){dialog_box=document.createElement('div');dialog_box.setAttribute('id',dialog_id);shade=document.createElement('div');shade.setAttribute('id','redips_dialog_shade');var body=document.getElementsByTagName('body')[0];body.appendChild(shade);body.appendChild(dialog_box);REDIPS.event.add(window,'resize',position);REDIPS.event.add(window,'scroll',position);request=initXMLHttpClient();};initXMLHttpClient=function(){var XMLHTTP_IDS,xmlhttp,success=false,i;try{xmlhttp=new XMLHttpRequest();}
catch(e1){XMLHTTP_IDS=['MSXML2.XMLHTTP.5.0','MSXML2.XMLHTTP.4.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP'];for(i=0;i<XMLHTTP_IDS.length&&!success;i++){try{success=true;xmlhttp=new ActiveXObject(XMLHTTP_IDS[i]);}
catch(e2){}}
if(!success){throw new Error('Unable to create XMLHttpRequest!');}}
return xmlhttp;};show=function(width,height,text,button1,button2){var input1='',input2='',param='',img_extensions,page_extensions,youtube_url,youtube_html='',div_img='',div_text='',img_text='';dialog_width=width;dialog_height=height;position();img_extensions=/(\.jpg|\.jpeg|\.gif|\.png)$/i;page_extensions=/(\.php|\.html)/i;youtube_url=/www\.youtube\.com/i;if(button1!==undefined){input1=input_html(button1);}
if(button2!==undefined){input2=input_html(button2);}
if(img_extensions.test(text)){img_text=text.split('|');if(img_text.length===1){div_img=image_tag(img_text[0]);}
else{div_img=image_tag(img_text[1]);div_text='<div>'+img_text[0]+'</div>';}
dialog_html(div_img+div_text,input1,input2);}
else if(page_extensions.test(text)){request.open('GET',text,true);request.onreadystatechange=function(){if(request.readyState===4){if(request.status===200){dialog_html(request.responseText);}
else{show.dialog_html('Error: ['+request.status+'] '+request.statusText);}}};request.send(null);}
else if(youtube_url.test(text)){youtube_html=REDIPS.dialog.youtube.replace(/_youtube_/g,text);dialog_html(youtube_html);}
else{div_text='<div>'+text+'</div>';dialog_html(div_img+div_text,input1,input2);}};dialog_html=function(html,input1,input2){if(input1===undefined){input1='';}
if(input2===undefined){input2='';}
dialog_box.innerHTML='<div class="redips_dialog_titlebar"><span title="Close" onclick="REDIPS.dialog.hide(\'undefined\')">'+REDIPS.dialog.close_button+'</span></div>'+'<table class="redips_dialog_tbl" cellpadding="0" cellspacing="0"><tr><td valign="center" height="'+dialog_height+'" width="'+dialog_width+'">'+
html+'<div class="redips_dialog_buttons">'+input1+input2+'</div>'+'</td></tr></table>';shade.style.display=dialog_box.style.display='block';fade(REDIPS.dialog.op_low,5);};hide=function(fnc,param){function_call=fnc;function_param=param;fade(REDIPS.dialog.op_high,-10);dialog_box.style.display='none';};input_html=function(button){var param,html;button=button.split('|');param=button[2];if(param!==undefined){param='\',\''+param;}
else{param='';}
html='<input type="button" onclick="REDIPS.dialog.hide(\''+button[1]+param+'\');" value="'+button[0]+'"/>';return html;};image_tag=function(image){var img,images,i;images=image.split(',');if(images.length===1){img='<div class="redips_dialog_imgc"><img src="'+images[0]+'" height="'+(dialog_height-40)+'"/></div>';}
else{img='<div class="redips_dialog_imgc" style="width:'+(dialog_width-8)+'px"><table><tr>';for(i=0;i<images.length;i++){img+='<td><img src="'+images[i]+'" height="'+(dialog_height-40)+'"/></td>';}
img+='</tr></table></div>';}
return img;};position=function(){var window_width,window_height,scrollX,scrollY;if(typeof(window.innerWidth)==='number'){window_width=window.innerWidth;window_height=window.innerHeight;scrollX=window.pageXOffset;scrollY=window.pageYOffset;}
else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){window_width=document.documentElement.clientWidth;window_height=document.documentElement.clientHeight;scrollX=document.documentElement.scrollLeft;scrollY=document.documentElement.scrollTop;shade.style.width=window_width+'px';shade.style.height=window_height+'px';}
else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){window_width=document.body.clientWidth;window_height=document.body.clientHeight;scrollX=document.body.scrollLeft;scrollY=document.body.scrollTop;}
dialog_box.style.left=((window_width-dialog_width)/2)+'px';dialog_box.style.top=((window_height-dialog_height)/2)+'px';shade.style.top=scrollY+'px';shade.style.left=scrollX+'px';};fade=function(opacity,step){shade.style.opacity=opacity/100;shade.style.filter='alpha(opacity='+opacity+')';opacity+=step;if(REDIPS.dialog.op_low<=opacity&&opacity<=REDIPS.dialog.op_high){setTimeout(function(){fade(opacity,step);},REDIPS.dialog.fade_speed);}
else if(REDIPS.dialog.op_low>opacity){shade.style.display='none';if(function_call!=='undefined'){window[function_call](function_param);}}};return{op_high:op_high,op_low:op_low,fade_speed:fade_speed,youtube:youtube,close_button:close_button,init:init,show:show,hide:hide};}());if(!REDIPS.event){REDIPS.event=(function(){var add,remove;add=function(obj,eventName,handler){if(obj.addEventListener){obj.addEventListener(eventName,handler,false);}
else if(obj.attachEvent){obj.attachEvent('on'+eventName,handler);}
else{obj['on'+eventName]=handler;}};remove=function(obj,eventName,handler){if(obj.removeEventListener){obj.removeEventListener(eventName,handler,false);}
else if(obj.detachEvent){obj.detachEvent('on'+eventName,handler);}
else{obj['on'+eventName]=null;}};return{add:add,remove:remove};}());}