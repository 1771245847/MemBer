// ==UserScript==
// @name             Vip解析
// @namespace       https://github.com/1771245847
// @version           1.0.0
// @icon              https://gitee.com/Bsutss/gitee.vip/raw/master/vip.jpg
// @description       vip视频解析
// @author            1771245847
// @license            MIT
// @supportURL        https://github.com/1771245847
// @match             *.le.com/*
// @match             *.iqiyi.com/*
// @match             *.youku.com/*
// @match             *.letv.com/*
// @match             *v.qq.com/*
// @match             *.tudou.com/*
// @match             *.mgtv.com/*
// @match             *.sohu.com/*
// @run-at            document-idle
// @grant             unsafeWindow
// ==/UserScript==
(function() {
    var apis = [
	{"name": "解析线路1", "url": "http://api.quanminjiexi.com/?v="},
    {"name": "解析线路2", "url": "http://jiexi44.qmbo.cn/jiexi/?url="},
    {"name": "解析线路3", "url": "https://lziplayer.com/?url="}];
    loadVipFunc();

	function loadVipFunc(){
	    var domain = location.href.split("?");
	    var ye = "<span style='display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;'>★</span>";
	    if (domain[0].match(".iqiyi.com") || domain[0].match(".youku.com") || domain[0].match(".le.com") || domain[0].match(".letv.com") || domain[0].match("v.qq.com") || domain[0].match(".tudou.com") || domain[0].match(".mgtv.com") || domain[0].match(".sohu.com")) {
    		var myBtn = document.createElement("div");
	    	myBtn.id = "myBtn2019";
    		myBtn.innerHTML = "➿‍";
    		myBtn.setAttribute("style", "width:12vw;height:12vw;position:fixed;bottom:25vh;right:10vw;z-index:100000;border-radius:100%;text-align:center;line-height:12vw;box-shadow:0px 1px 3px rgba(0,0,0,0.3);font-size:4.5vw;background:#fafafa;");
    		myBtn.onclick = function() {
			    loadVip(location.href);
		    };
	    	document.body.appendChild(myBtn);
    		var myul = document.createElement("ul");
		    myul.id = "myul2019";
	    	myul.setAttribute("style", "display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:35vh;right:12vw;z-index:99999;height:60vh;overflow:scroll;border-radius:1.26vw;");
	    	for (var i = 0; i < apis.length; i++) {
	    		var myli = document.createElement("li");
	    		var that = this;
    			myli.setAttribute("style", "margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:33.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;"); 
    			(function(num) {
			    	myli.onclick = function() {
			    		window.open(apis[num].url + tryGetRealUrl(location.href), '_blank');
		    		};
		    		myli.ontouchstart = function() {
				    	this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";
			    	};
			    	myli.ontouchend = function() {
				    	this.style.cssText += "color:black;background:transparent;border-radius:0;";
			    	};
		    	})(i);
		    	myli.innerHTML = apis[i].name;
		    	myul.appendChild(myli)
	    	}
	    	document.body.appendChild(myul);
    		//让视频区域显示文字，直接解析
		    showVipTitle(location.href);
	    }
	}
	function showVipTitle(url) {
		var titleStr = "视频连接成功！点击选择解析接口";
		if (url.indexOf("iqiyi.com") != -1) {
			var iframe = document.getElementById('_if');
			if (iframe) {
				window.location.reload();
				return;
			};
			var i = document.getElementsByClassName('m-video-player-wrap')[0];
			if (typeof(i) != 'undefined') {
				i.style.height = '220px';
				i.style.color = '#fff';
				i.style.lineHeight = '15';
				i.style.position = 'static';
				i.style.paddingTop = '0%';
				i.style.background = '#000000';
				i.style.textAlign = 'center';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('tap',
				function() {
					loadVip(window.location.href);
				})
			};
		} else if (url.indexOf("v.qq.com") != -1) {
			var i = document.getElementsByClassName('site_player')[0];
			if (typeof(i) != 'undefined') {
				i.style.height = '210px';
				i.style.background = '#000000';
				i.style.textAlign = 'center';
				i.style.color = '#fff';
				i.style.lineHeight = '14';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				})
			};
		} else if (url.indexOf("m.le.com") != -1) {
			var i = document.getElementsByClassName('playB')[0];
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.style.width = '100%';
				i.style.textAlign = 'center';
				i.style.lineHeight = '14';
				i.style.color = '#fff';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("youku.com") != -1) {
			var i = document.getElementById('playerBox');
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.style.color = '#fff';
				i.style.textAlign = 'center';
				i.style.lineHeight = '15';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("mgtv.com") != -1) {
			var i = document.getElementsByClassName('video-area')[0];
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.style.color = '#fff';
				i.style.textAlign = 'center';
				i.style.lineHeight = '16';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('click',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("sohu.com") != -1) {
			var i = document.getElementsByClassName('x-player')[0];
			var x = document.getElementById('top-poster');
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.style.color = '#fff';
				i.style.textAlign = 'center';
				i.style.lineHeight = '13';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				})
			} else if (typeof(x) != 'undefined') {
				x.style.background = '#000000';
				x.style.color = '#fff';
				x.style.height = '210px';
				x.style.textAlign = 'center';
				x.style.lineHeight = '13';
				i.innerHTML = '<div>' + titleStr + '</div>';
				x.addEventListener('click',
				function() {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("baofeng.com") != -1) {
			var myVideo = document.getElementsByTagName('video')[0];
			myVideo.pause();
			var i = document.getElementById('videoplayer');
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.style.textAlign = 'center';
				i.style.color = '#fff';
				i.style.lineHeight = '17';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		}
	}
	function tryGetRealUrl(url) {
		var realUrl = url;
		try {
			realUrl = getRealUrl(url);
		} catch(err) {
			console.log(err);
		}
		return realUrl;
	}
	function getYoukuRealUrl(url) {
		var li = document.getElementsByClassName('hot-row-bottom')[0].children[0];
		var data = li.getAttribute('data-param');
		var s = data.split('svid=');
		if (s.length > 1) {
			var svid = s[1].split('&')[0];
			return 'https://v.youku.com/v_show/id_' + svid + '.html';
		}
		return url;
	}
	function getRealUrl(url) {
		var dataurl2 = url;
		var txurlc = dataurl2.split(":");
		var txurl = txurlc[1].slice(0, 12);
		var ykurl = txurlc[1].slice(0, 13);
		var ykdata = txurlc[1].slice(13);
		var funurl = txurlc[1].slice(0, 11);
		if (ykurl == '//m.youku.com') {
			return getYoukuRealUrl(url);
		}
		if (ykurl == '//m.youku.com') {
			var txurlc = dataurl2.split(":");
			var ykurl = txurlc[1].slice(0, 13);
			var ykdata = txurlc[1].slice(13);
			dataurl2 = 'http://www.youku.com' + ykdata;
		} else if (ykurl == '//m.iqiyi.com') {
			var txurlc = dataurl2.split(":");
			var ykurl = txurlc[1].slice(0, 13);
			var ykdata = txurlc[1].slice(13);
			dataurl2 = 'https://www.iqiyi.com' + ykdata;
		} else if (txurl == '//m.v.qq.com') {
			var vid = getParam(dataurl2, "vid");
			var cid = getParam(dataurl2, "cid");
			var txdata2 = dataurl2.split("?");
			var str = "play.html";
			if (txdata2[0].slice(txdata2[0].length - str.length) == str) {
				if (cid.length > 1) {
					dataurl2 = "https://v.qq.com/x/cover/" + cid + ".html";
					return dataurl2;
				} else if (vid.length == 11) {
					return "https://v.qq.com/x/page/" + vid + ".html";
				}
			}
			cid = txdata2[0].slice( - 20, -5);
			if (vid.length == 11) {
				dataurl2 = 'https://v.qq.com/x/cover/' + cid + '/' + vid + '.html';
			} else {
				dataurl2 = 'https://v.qq.com/x/cover/' + cid + '.html';
			}
		} else if (ykurl == '//m.le.com/vp') {
			var leurlc = dataurl2.split("_");
			var leurl = leurlc[1];
			dataurl2 = 'http://www.le.com/ptv/vplay/' + leurl;
		}
		return dataurl2;
	}
	function getParam(dataurl2, name) {
		return dataurl2.match(new RegExp('[?&]' + name + '=([^?&]+)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
	}
	function loadVip(url) {
		var myBtn = document.getElementById("myBtn2019");
		var myul = document.getElementById("myul2019");
		if (myul.style.display == "none") {
			myul.style.display = "block";
			myBtn.innerHTML = "➕";
			myBtn.style.transform = "rotateZ(45deg)";
		} else {
			myul.style.display = "none";
			myBtn.innerHTML = "➿";
			myBtn.style.transform = "rotateZ(0deg)";
		}
	}
})();

