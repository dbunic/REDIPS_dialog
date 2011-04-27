/*
Copyright (c) 2008-2011, www.redips.net  All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/dialog-box/
Version 1.4.4
Mar 13, 2011.
*/
"use strict";var REDIPS=REDIPS||{};REDIPS.dialog=(function(){var init,show,hide,image_tag,position,visibility,fade,input_html,op_high=60,op_low=0,fade_speed=18,youtube='<object width="640" height="390">'+'<param name="movie" value="http://_youtube_?&version=2&fs=0&rel=0&iv_load_policy=3&color2=0x6A93D4"></param>'+'<param name="allowFullScreen" value="true"></param>'+'<param name="allowScriptAccess" value="always"></param>'+'<embed src="http://_youtube_?&version=2&fs=0&rel=0&iv_load_policy=3&color2=0x6A93D4" '+'type="application/x-shockwave-flash" '+'allowfullscreen="true" '+'allowscriptaccess="always" '+'width="640" height="390">'+'</embed>'+'</object>',shade,dialog_box,dialog_width=0,dialog_height=0,function_call,function_param,dialog_id='REDIPS_dialog';init=function(){dialog_box=document.createElement('div');dialog_box.setAttribute('id',dialog_id);shade=document.createElement('div');shade.setAttribute('id','REDIPS_shade');var body=document.getElementsByTagName('body')[0];body.appendChild(shade);body.appendChild(dialog_box);REDIPS.event.add(window,'resize',position);REDIPS.event.add(window,'scroll',position);};show=function(width,height,text,button1,button2){var input1='',input2='',param='',img_extensions,youtube_url,youtube_html='',div_img='',div_text='',img_text='';dialog_width=width;dialog_height=height;position();img_extensions=/(\.jpg|\.jpeg|\.gif|\.png)$/i;youtube_url=/www\.youtube\.com/i;if(img_extensions.test(text)){img_text=text.split('|');if(img_text.length===1){div_img=image_tag(img_text[0]);}
else{div_img=image_tag(img_text[1]);div_text='<DIV>'+img_text[0]+'</DIV>';}}
else if(youtube_url.test(text)){youtube_html=REDIPS.dialog.youtube.replace(/_youtube_/g,text);}
else{div_text='<DIV>'+text+'</DIV>';}
if(button1!==undefined){input1=input_html(button1);}
if(button2!==undefined){input2=input_html(button2);}
dialog_box.innerHTML='<DIV class="REDIPS_titlebar"><SPAN title="Close" onclick="REDIPS.dialog.hide(\'undefined\')">✕</SPAN></DIV>'+'<TABLE class="REDIPS_table" cellpadding="0" cellspacing="0"><TR><TD valign="center" height="'+height+'" width="'+width+'">'+
div_img+
div_text+
youtube_html+'<DIV>'+input1+input2+'</DIV>'+'</TD></TR></TABLE>';shade.style.display=dialog_box.style.display='block';visibility('hidden');fade(REDIPS.dialog.op_low,10);};hide=function(fnc,param){function_call=fnc;function_param=param;fade(REDIPS.dialog.op_high,-20);dialog_box.style.display='none';visibility('visible');};input_html=function(button){var param,html;button=button.split('|');param=button[2];if(param!==undefined){param='\',\''+param;}
else{param='';}
html='<input type="button" onclick="REDIPS.dialog.hide(\''+button[1]+param+'\');" value="'+button[0]+'"/>';return html;};image_tag=function(image){var img,images,i;images=image.split(',');if(images.length===1){img='<DIV class="REDIPS_imgc"><IMG src="'+images[0]+'" height="'+(dialog_height-40)+'"/></DIV>';}
else{img='<DIV class="REDIPS_imgc" style="width:'+(dialog_width-8)+'px"><TABLE><TR>';for(i=0;i<images.length;i++){img+='<TD><IMG src="'+images[i]+'" height="'+(dialog_height-40)+'"/></TD>';}
img+='</TR></TABLE></DIV>';}
return img;};position=function(){var window_width,window_height,scrollX,scrollY;if(typeof(window.innerWidth)==='number'){window_width=window.innerWidth;window_height=window.innerHeight;scrollX=window.pageXOffset;scrollY=window.pageYOffset;}
else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){window_width=document.documentElement.clientWidth;window_height=document.documentElement.clientHeight;scrollX=document.documentElement.scrollLeft;scrollY=document.documentElement.scrollTop;shade.style.width=window_width+'px';shade.style.height=window_height+'px';}
else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){window_width=document.body.clientWidth;window_height=document.body.clientHeight;scrollX=document.body.scrollLeft;scrollY=document.body.scrollTop;}
dialog_box.style.left=((window_width-dialog_width)/2)+'px';dialog_box.style.top=((window_height-dialog_height)/2)+'px';shade.style.top=scrollY+'px';shade.style.left=scrollX+'px';};visibility=function(p){var obj=[],x,y,e;obj[0]=document.getElementsByTagName('select');obj[1]=document.getElementsByTagName('iframe');obj[2]=document.getElementsByTagName('object');for(x=0;x<obj.length;x++){for(y=0;y<obj[x].length;y++){e=obj[x][y];while(e&&e.id!==dialog_id){e=e.parentNode;}
if(e&&e.id===dialog_id){continue;}
obj[x][y].style.visibility=p;}}};fade=function(opacity,step){shade.style.opacity=opacity/100;shade.style.filter='alpha(opacity='+opacity+')';opacity+=step;if(REDIPS.dialog.op_low<=opacity&&opacity<=REDIPS.dialog.op_high){setTimeout(function(){fade(opacity,step);},REDIPS.dialog.fade_speed);}
else if(REDIPS.dialog.op_low>opacity){shade.style.display='none';if(function_call!=='undefined'){window[function_call](function_param);}}};return{op_high:op_high,op_low:op_low,fade_speed:fade_speed,youtube:youtube,init:init,show:show,hide:hide};}());if(!REDIPS.event){REDIPS.event=(function(){var add,remove;add=function(obj,eventName,handler){if(obj.addEventListener){obj.addEventListener(eventName,handler,false);}
else if(obj.attachEvent){obj.attachEvent('on'+eventName,handler);}
else{obj['on'+eventName]=handler;}};remove=function(obj,eventName,handler){if(obj.removeEventListener){obj.removeEventListener(eventName,handler,false);}
else if(obj.detachEvent){obj.detachEvent('on'+eventName,handler);}
else{obj['on'+eventName]=null;}};return{add:add,remove:remove};}());}