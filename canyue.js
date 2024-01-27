// ==UserScript==
// @name              VIP视频解析
// @namespace         1771245847
// @version           1.0.0
// @icon              https://gitee.com/Bsutss/gitee.vip/raw/master/vip.jpg
// @description       解析各大视频网站VIP视频，支持优酷，爱奇艺，乐视，腾讯视频，芒果TV
// @author            1771245847
// @license           MIT
// @supportURL        https://gitee.com
// @match             *://v.youku.com/v_*
// @match             *://m.youku.com/v*
// @match             *://m.youku.com/a*
// @match             *://*.iqiyi.com/v_*
// @match             *://*.iqiyi.com/w_*
// @match             *://*.iqiyi.com/a_*
// @match             *://*.iqiyi.com/dianying/*
// @match             *://*.le.com/ptv/vplay/*
// @match             *v.qq.com/x/cover/*
// @match             *v.qq.com/x/page/*
// @match             *v.qq.com/play*
// @match             *://*.tudou.com/listplay/*
// @match             *://*.tudou.com/albumplay/*
// @match             *://*.tudou.com/programs/view/*
// @match             *://*.mgtv.com/b/*
// @match             *://film.sohu.com/album/*
// @match             *://tv.sohu.com/*
// @match             *://*.bilibili.com/video/*
// @match             *://*.bilibili.com/anime/*
// @match             *://*.bilibili.com/bangumi/play/*
// @match             *://vip.pptv.com/show/*
// @match             *://v.pptv.com/show/*
// @match             *://*.baofeng.com/play/*
// @match             *://v.yinyuetai.com/video/*
// @match             *://v.yinyuetai.com/playlist/*
// @match             *://vip.1905.com/play/*
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle('.h-icon-play {color: #d926b5;fill: #d926b5;height: 80px;width: 80px;position: fixed;z-index: 99999;top: 180px;left: 0;cursor: pointer;}  .h-ol {position: fixed;top: 250px;left: 20px;z-index: 99999;counter-reset: li;list-style: none;font-size: 14px;padding: 0;margin-bottom: 4em;text-shadow: 0 1px 0 rgba(255, 255, 255, .5);display: none;}  .h-ol a {position: relative;display: block;padding: 3px 10px 3px 2em;margin: 0.5em 0;background: #ddd;color: #444;text-decoration: none;border-radius: 0.3em;transition: all 0.3s ease-out;}  .h-ol a:hover {background: #eee;color: #ff6f5c;transition: all 0.3s ease-out;}  .h-ol a::before {content: counter(li);counter-increment: li;position: absolute;left: -1.2em;top: 50%;margin-top: -1.2em;background: #87ceeb;height: 2em;width: 2em;line-height: 2em;border: 0.2em solid #fff;text-align: center;font-weight: bold;border-radius: 2em;}');

  let api = [
    {name: "初心解析", "url": "http://jx.bwcxy.com/?v="},
    {name: "芒果解析", "url": "http://www.guandianzhiku.com/v/s/?url="},	
    {name: "科技解析", "url": "http://ka61b.cn/jx.php?url="},
    {name: "清风明月", "url": "http://fateg.xyz/?url="},
    {name: "爱看解析", "url": "http://jx.ikandie.cn/?url="},
    {name: "紫云解析", "url": "https://api.smq1.com/?url="},
    {name: "够买解析", "url": "http://jx.vipshares.xyz/index1.php?url="},
    {name: "人人解析", "url": "https://vip.mpos.ren/v/?url="},			
    {name: "初见解析", "url": "http://chujian.xiaoyule-app.cn/?url="},		
    {name: "黑米解析", "url": "https://www.heimijx.com/jx/api/?url="},	
    {name: "飞鸟云播", "url": "http://jx.ledboke.com/?url="},
    {name: "冰河解析", "url": "http://jx.duzhiqiang.com/?url="},
    {name: '金桥解析', url: 'http://jqaaa.com/jx.php?url='},
    {name: '腾讯稳定', url: 'http://jx.618ge.com/?url='},
    {name: '无敌解析', url: 'https://z1.m1907.cn/?jx='},
    {name: '无名解析', url: 'https://beaacc.com/api.php?url='},
    {name: '通用接口', url: 'http://jx.aeidu.cn/index.php?url='}];


  let main = {
    showButton: function () {
      if (location.host.match(/youku|iqiyi|le|qq|tudou|mgtv|sohu|acfun|bilibili|pptv|baofeng|yinyuetai/ig)) {
        let mainButton = '<div class="h-icon-play" title="点击显示解析地址"><svg viewBox="0 0 512 512"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"></path></svg></div>';
        let apiList = '<ol class="h-ol"></ol>';
        let github = '<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=media&type=star&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 110px;padding: 0 5px;box-sizing: border-box;margin-top: 10px;"></iframe>';
        $(top.document.body).append(mainButton);
        $(top.document.body).append(apiList);

        api.forEach((val, index) => {
          $('.h-ol').append(`<li><a target="_blank" href="${val.url + encodeURI(location.href)}">${val.name}</a></li>`)
        });
        //谢谢赞赏
        $('.h-ol').append(`<li><a target="_blank" style="color: #999;" href="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/587a875c8f1c693b6e663840af56569b1c0376a0acae1faa3fec7a1c31d49bca94740b091b501afc692a30da1960c4e0?pictype=scale&from=30113&version=3.3.3.3&fname=wx.png&size=750">谢谢赞赏</a></li>`);
        $('.h-ol').append(github);

        $(top.document.body).on('click', '.h-icon-play', () => {
          $('.h-ol').fadeToggle('fast');
        });
      }
    }
  };

  $(function () {
    main.showButton();
  });
})();
