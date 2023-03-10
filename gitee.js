// ==UserScript==
// @name         VIP解析
// @namespace    https://gitee.com/
// @version      1.0
// @description  修复不初始化插件的bug
// @description  支持优酷vip，腾讯vip，爱奇艺vip，芒果vip等常用视频，都是用的网络资源来解析，随时可能失效
// @author       1771245847
// @icon         https://gitee.com/Bsutss/gitee.vip/raw/master/vip.jpg
// @include      *://v.youku.com/v_*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.iqiyi.com/adv*
// @include      *v.qq.com/x/cover/*
// @include      *v.qq.com/x/page/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.tudou.com/v*
// @include      *://*.mgtv.com/b/*
// @include      *://tv.sohu.com/v/*
// @include      *://*.pptv.com/show/*
// @require      https://gitee.com/Bsutss/gitee.vip/raw/master/gitee.js
// @grant        none
// ==/UserScript==

(function() {
    var sites = ["youku.com", "iqiyi.com", "qq.com", "tudou.com", "tv.sohu.com", "pptv.com", "mgtv.com"];
    var href = window.location.href;
    var flag = false;
    var prefix = href.indexOf("?") !=-1 ? href.substring(0, href.indexOf("?")) : href;
    $.each(sites,function(index,value){
        if(prefix.indexOf(value) !=-1){
            flag = true;
            return false;
        }
    });
    console.log("flag="+flag);
    if(!flag){
        return;
    }
    console.log("初始化视频解析");

    // 定义能解析的网站
    var menus = [
        {
            "title": "无名站",
            "href": "https://www.administratorw.com/video.php?url=",
            "class": "menu-first"
        },
        {
            "title": "618解析",
            "href": "http://jx.618g.com/?url",
            "class": "menu-second"
        },
        {
            "title": "金桥解析",
            "href": "http://jqaaa.com/jq3/?url=",
            "class": "menu-third"
        },
        {
            "title": "煎饼VIP",
            "href": "http://vip.jbsou.cn/?url=",
            "class": "menu-fourth"
        }
    ];
    // 组装免费解析的元素字符串
    var str = "";
    $.each(menus, function(i, o) {
        str += '<a href="' + o.href + href + '" title="' + o.title + '" class="menu-item ' + o.class + '" target="_blank">' + o.title +  '</a>';
    });

    // 要添加到body的菜单元素
    var sidenav = '<div>' +
        '<svg width="0" height="0">'+
        '<defs>'+
        '<filter id="goo">'+
        '<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>'+
        '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix>'+
        '<feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>'+
        '</filter>'+
        '</defs>'+
        '</svg>'+
        '<div class="aside-nav bounceInUp animated" id="aside-nav">'+
        '<label for="" class="aside-menu" title="按住拖动">VIP</label>'+
        str +
        '</div>'+
        '</div>';
    // 添加到body上
    $("body").append(sidenav).append($('<link rel="stylesheet" href="//cdn.wandhi.com/style/tv/asidenav.css">'));

    // 菜单的事件
    var ua = navigator.userAgent;
    /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#aside-nav").addClass("no-filter");
    var drags = {
        down: !1,
        x: 0,
        y: 0,
        winWid: 0,
        winHei: 0,
        clientX: 0,
        clientY: 0
    },
        asideNav = $("#aside-nav")[0],
        getCss = function(a, e) {
            return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
        };
    $("body").on("mousedown", "#aside-nav", function(a) {
        drags.down = !0,
            drags.clientX = a.clientX,
            drags.clientY = a.clientY,
            drags.x = getCss(this, "right"),
            drags.y = getCss(this, "top"),
            drags.winHei = $(window).height(),
            drags.winWid = $(window).width(),
            $(document).on("mousemove", function(a) {
            if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50)) //50px
                return !1 /*,console.log(!1)*/ ;
            if (a.clientY < 180 || a.clientY > drags.winHei - 120) //导航高度
                return !1;
            var e = a.clientX - drags.clientX,
                t = a.clientY - drags.clientY;
            asideNav = asideNav || $("#aside-nav")[0];
            asideNav.style.top = parseInt(drags.y) + t + "px";
            asideNav.style.right = parseInt(drags.x) - e + "px";
        })
    }).on("mouseup", "#aside-nav", function() {

        drags.down = !1, $(document).off("mousemove")
    });

})();
