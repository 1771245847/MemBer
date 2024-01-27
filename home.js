// ==UserScript==
// @name         vip视频解析
// @namespace    vip解析
// @version      1.0.0
// @description  解析各大视频网站，直接跳转以及备用接口跳转
// @author       1771245847
// @org-author   https://gitee.com/
// @icon         https://gitee.com/Bsutss/gitee.vip/raw/master/vip.jpg
// @match        *://*.iqiyi.com/v_*
// @match        *://v.youku.com/*
// @match        *://*.le.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://vip.1905.com/play/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @grant        GM_addStyle
// ==/UserScript==

//日志函数
var debug = false;
var log_count = 1;
function slog(c1,c2,c3){
    c1 = c1?c1:'';
    c2 = c2?c2:'';
    c3 = c3?c3:'';
    if(debug) console.log('#'+ log_count++ +'-ScriptLog:',c1,c2,c3);
}

var theplayurl = window.location.href;

(function() {
    'use strict';
    GM_addStyle('#TManays{z-index:99999; position:absolute; left:0px; top:0px; width:170px; height:auto; border:0; margin:0;}'+
                '#TMul{position:fixed; left:-156px; top:145px;width:140px; background-color:#555; opacity:0.8; border:3px solid #555; list-style:none; margin:0; padding:5px;}'+
                '#TMul li{margin:0; padding:3px;} '+
                '#TMul li a{font-size:15px; margin:0; padding:3px; color:white;} '+
                '#TMGobtn{position:fixed; left:0; top:100px;cursor:pointer;outline:none; width:70px; height:40px; border-width:2px 4px 2px 0px; border-color:#ffff00; background-color:#ffff00; border-style:solid; font:12px "微软雅黑"; color:#ff0000; margin:0; padding:0;} '+
                '#TMbtn{position:fixed; left:0; top:145px;cursor:pointer;outline:none; width:70px; height:40px; border-width:2px 4px 2px 0px; border-color:#ffff00; background-color:#ffff00; border-style:solid; font:12px "微软雅黑"; color:#aaa; margin:0; padding:0;}');
    function btnTg(){
		var btn=document.getElementById("TMbtn");
		var ul=document.getElementById("TMul");
		if(btn.style.left===""||parseInt(btn.style.left)<10){btn.style.left=156+"px";ul.style.left=0; btn.innerText="◁";}else{btn.style.left=0;ul.style.left=-156+"px"; btn.innerText="▷";}
	}

    //添加爱奇艺VIP的解析方式
	function preload_all(){
		if(theplayurl.indexOf('iqiyi') > 0) preload_iqiyi();
	}

    function preload_iqiyi(){
        slog('albumId',Q.PageInfo.playPageInfo.albumId);
        if(Q.PageInfo.playPageInfo.albumId !== undefined ){
            var s = document.createElement("script"), el = document.getElementsByTagName("script")[0];
            s.async = false;
            s.src = document.location.protocol + "//cache.video.qiyi.com/jp/avlist/"+ Q.PageInfo.playPageInfo.albumId +"/1/50/";
            el.parentNode.insertBefore(s, el);
        }
	}
	function prego_all(){
		if(theplayurl.indexOf('iqiyi') > 0) prego_iqiyi();
	}
    function prego_iqiyi(){
		var ele = document.querySelectorAll('li[class="item selected"] > span').length ? document.querySelectorAll('li[class="item selected"] > span')[1] : document.querySelectorAll('li[class="item no selected"] > span')[1];
        if(ele !== undefined ){
            var pd = ele.parentNode.getAttribute('data-pd');
            if(pd > 0){
                var vinfo = tvInfoJs.data.vlist[pd-1];
                if(vinfo.vurl.length > 0){
                    theplayurl = vinfo.vurl;
                }
            }
        }
    }
    function btnGo(){
        prego_all();
        window.open('https://thinkibm.now.sh/?url='+theplayurl, "_blank");//默认使用解析，直接跳转
    }
    preload_all();
    var div=document.createElement("div");
    div.innerHTML='<div id="TManays">'+
  '<ul id="TMul">'+
        '<li><a href="http://jx.598110.com/?url='+theplayurl+'" target="_blank">接口①</a></li>'+
        '<li><a href="http://vip.jlsprh.com/?url='+theplayurl+'" target="_blank">接口②</a></li>'+
        '<li><a href="http://api.baiyug.vip/index.php?url='+theplayurl+'" target="_blank">接口③</a></li>'+
        '<li><a href="https://www.bavei.com/vip2/?url='+theplayurl+'" target="_blank">接口④</a></li>'+
        '<li><a href="https://jx.idc126.net/jx/?url='+theplayurl+'" target="_blank">接口⑤</a></li>'+
   '</ul>'+
	'<button id="TMGobtn">VIP解析 ▶</button>'+
	'<button id="TMbtn">备用 ▷</button>'+
  '</div>';
    document.body.appendChild(div);
    document.querySelector("#TMGobtn").addEventListener("click",btnGo,false);
    document.querySelector("#TMbtn").addEventListener("click",btnTg,false);
})();
