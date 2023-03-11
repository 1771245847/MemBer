// ==UserScript==
// @name           全网VIP视频解析
// @name:zh-TW    vip
// @namespace      1771245877
// @version           1.2.0
// @description       Vip视频解析
// @author            1771245847
// @include           *://xbeibeix.com/api/bilibili/biliplayer/*
// @include           *://xbeibeix.com/api/bilibili/*
// @include           *://*.youku.com/v_*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.iq.com/play*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/tv/*
// @include           *://*.tudou.com/listplay/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.mgtv.com/b/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/v/*
// @include           *://*.acfun.cn/v/*
// @include           *://*.bilibili.com/video/*
// @include           *://*.bilibili.com/bangumi/play/*
// @include           *://*.baofeng.com/play/*
// @include           *://vip.pptv.com/show/*
// @include           *://v.pptv.com/show/*
// @include           *://www.le.com/ptv/vplay/*
// @include           *://vip.1905.com/play/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://www.acfun.cn/v/*
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/*
// @include           *://m.iqiyi.com/kszt/*
// @include           *://m.youku.com/alipay_video/*
// @include           *://m.mgtv.com/b/*
// @include           *://m.tv.sohu.com/v/*
// @include           *://m.film.sohu.com/album/*
// @include           *://m.le.com/ptv/vplay/*
// @include           *://m.pptv.com/show/*
// @include           *://m.acfun.cn/v/*
// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/bangumi/play/*
// @require           https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require           https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_addStyle
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @license           GPL License
// ==/UserScript==
(function() {
	'use strict';
	//*******************提示*************//
	//如遇到问题或者有什么优化建议请联系我//
	//这样才能够更好的完善改脚本，让大家使//
	//用起来更方便，谢谢大家 //

	var index_num = 0,item = [],urls = [],
	playerList=[

            {"name": "M3U8TV", "type": "1-2-3", "url": "https://jx.m3u8.tv/jiexi/?url="},
            {"name": "Player-JY", "type": "1-2-3", "url": "https://jx.playerjy.com/?url="},
            {"name": "虾米", "type": "1-2-3", "url": "https://jx.xmflv.com/?url="},
            {"name": "OK", "type": "3", "url": "https://api.okjx.cc:3389/jx.php?url="},
            {"name": "OKJX", "type": "3", "url": "https://okjx.cc/?url="},
            {"name": "MAO", "type": "1", "url": "https://www.mtosz.com/m3u8.php?url="},
            {"name": "爱豆", "type": "1-2-3", "url": "https://jx.aidouer.net/?url="},
            {"name": "夜幕", "type": "1-2-3", "url": "https://www.yemu.xyz/?url="},
            {"name": "4kdv", "type": "1-2-3", "url": "https://jx.4kdv.com/?url="},
            {"name": "1717", "type": "1-2-3", "url": "https://ckmov.ccyjjd.com/ckmov/?url="},
            {"name": "qianqi", "type": "1-2-3", "url": "https://api.qianqi.net/vip/?url="},
            {"name": "laobandq", "type": "1-2-3", "url": "https://vip.laobandq.com/jiexi.php?url="},
            {"name": "CK", "type": "1-2-3", "url": "https://www.ckplayer.vip/jiexi/?url="},
            {"name": "盘古", "type": "1-2-3", "url": "https://go.yh0523.cn/y.cy?url="},
            {"name": "解析la", "type": "1-2-3", "url": "https://api.jiexi.la/?url="},
            {"name": "H8", "type": "1-2-3", "url": "https://www.h8jx.com/jiexi.php?url="},
            {"name": "17云", "type": "1-2", "url": "https://www.1717yun.com/jx/ty.php?url="},
			{"name": "pangu", "type": "1-2-3", "url": "https://www.pangujiexi.cc/jiexi.php?url="},
			{"name":"七哥", "type": "1-2-3","url":"https://jx.mmkv.cn/tv.php?url="},
			{"name":"ckmov","type": "1-2-3","url":"https://www.ckmov.vip/api.php?url="},
			{"name":"playerjy/B站","type": "1-2-3","url":"https://jx.playerjy.com/?url="},
			{"name":"诺诺","type": "1-2-3","url":"https://www.ckmov.com/?url="},
			{"name":"BL","type": "1-2-3","url":"https://vip.bljiex.com/?v="},
			{"name":"盖世","type": "1-2-3","url":"https://www.gai4.com/?url="},
			{"name":"8090","type": "1-2-3","url":"https://www.8090g.cn/?url="},
			{"name":"诺讯","type": "1-2-3","url":"https://www.nxflv.com/?url="},
			{"name": "Blbo", "type": "1-2-3", "url": "https://jx.blbo.cc:4433/?url="},
            {"name": "无名小站", "type": "1-2-3", "url": "https://www.administratorw.com/video.php?url="},
			{"name": "综合/B站", "type": "1-2-3", "url": "https://jx.bozrc.com:4433/player/?url="},

        ],
		node=[
			{"url":"w.mgtv.com","type": "1","node":"#mgtv-player-wrap"},
			{"url":"www.mgtv.com","type": "1","node":"#mgtv-player-wrap"},
			{"url":"m.mgtv.com","type": "2","node":".mg-video"},
			{"url": "www.iqiyi.com","type": "1","node": "#flashbox"},
			{"url":"www.iq.com","type": "1","node":".intl-video-wrap"},
			{"url": "m.iqiyi.com","type": "2","node": ".m-video-player"},
			{"url":"v.youku.com","type": "1","node":"#player"},
			{"url":"m.youku.com","type": "2","node":".ykplayer"},
			{"url":"v-wb.youku.com","type": "1","node":"#player"},
			{"url":"vku.youku.com","type": "1","node":"#player"},
			{"url":"video.tudou.com","type": "1","node":".td-playbox"},
			{"url":"v.qq.com","type": "1","node" :"#player-container|#mod_player|.container-player"},//"node": "#mod_player"
			{"url":"m.v.qq.com","type": "2","node": "#player"},
			{"url":"3g.v.qq.com","type": "2","node": "#mod_player"},
			{"url":"tv.sohu.com","type": "1","node":"#player"},
			{"url":"pad.tv.sohu.com","type": "2","node":"#player"},
			{"url":"m.tv.sohu.com","type": "2","node":".x-player"},
			{"url":"film.sohu.com","type": "1","node":"#playerWrap"},
			{"url":"www.acfun.cn","type": "1","node": "#player"},
			{"url":"m.fun.tv","type": "2","node": "#j-player-layout"},
			{"url":"fun.tv","type": "1","node": "#html-video-player-layout"},
			{"url":"www.le.com","type": "1","node":"#le_playbox"},
			{"url":"m.le.com","type": "2","node":"#j-player"},
			{"url":"vip.1905.com","type": "1","node":"#player"},
			{"url":"v.pptv.com","type": "1","node":"#pptv_playpage_box"},
			{"url":"vip.pptv.com","type": "1","node":".w-video"},
			{"url":"m.pptv.com","type": "2","node":".p-video"},
			{"url":"www.wasu.cn","type": "1","node":"#flashContent"},
			{"url":"www.bilibili.com","type": "1","node":"#player_module|#bilibiliPlayer"},
			{"url":"m.bilibili.com","type": "2","node":".player-wrapper"},

		];
	const coupon = {
	isClose: false,
	isRun: () => {
		var urls = ["tmall.com", "taobao.com", "tmall.hk", "liangxinyao.com", "jd.com", "jd.hk", "yiyaojd.com"];
		for (var i = 0; i < urls.length; i++) {
			if (window.location.host.indexOf(urls[i]) != -1) {
				return true;
			}
		}
		return false;
	},
	initCss: () => {
		let css = `
				.gwd_taobao .gwd-minibar-bg, .gwd_tmall .gwd-minibar-bg {
					display: block;
				}
				.idey-minibar_bg{
					position: relative;
					min-height: 40px;
					display: inline-block;
				}
				#idey_minibar{
					width: 525px;
					background-color: #fff;
					position: relative;
					border: 1px solid #e8e8e8;
					display: block;
					line-height: 36px;
					font-family: 'Microsoft YaHei',Arial,SimSun!important;
					height: 36px;
					float: left;
				}
				#idey_minibar .idey_website {
					width: 48px;
					float: left;
					height: 36px;
				}
				#idey_minibar .minibar-tab {
					float: left;
					height: 36px;
					border-left: 1px solid #edf1f2!important;
					padding: 0;
					margin: 0;
					text-align: center;
				}

				#idey_minibar .idey_website em {
					background-position: -10px -28px;
					height: 36px;
					width: 25px;
					float: left;
					margin-left: 12px;
				}
				.setting-bg {
					background: url() no-repeat;
				}
				#idey_minibar .minibar-tab {
					float: left;
					height: 36px;
					border-left: 1px solid #edf1f2!important;
					padding: 0;
					margin: 0;
					width: 134px;
				}
				#idey_price_history span {
					float: left;
					width: 100%;
					text-align: center;
					line-height: 36px;
					color: #666;
					font-size: 14px;
				}

				#mini_price_history .trend-error-info-mini {
					position: absolute;
					top: 37px;
					left: 0px;
					width: 100%;
					background: #fff;
					z-index: 99999999;
					height: 268px;
					box-shadow: 0px 5px 15px 0 rgb(23 25 27 / 15%);
					border-radius: 0 0 4px 4px;
					width:559px;
					border: 1px solid #ddd;
					border-top: none;
					display:none;

				}
				.minibar-btn-box {
					display: inline-block;
					margin: 0 auto;
					float: none;
				}
				#mini_price_history .error-p {
					  width: 95px;
					  margin: 110px auto;
					  height: 20px;
					  line-height: 20px;
					  text-align: center;
					  color: #000!important;
					  border: 1px solid #333;
					  border-radius: 5px;
					  display: block;
					  text-decoration: none!important;
					}
				 #mini_price_history:hover .trend-error-info-mini {
					  display: block;
					}

				.collect_mailout_icon {
					background-position: -247px -134px;
					width: 18px;
				}

				#idey_mini_compare_detail li *, .mini-compare-icon, .minibar-btn-box * {
					float: left;
				}
				.panel-wrap{
					width: 100%;
					height: 100%;
				}
				.collect_mailout_icon, .mini-compare-icon {
					height: 18px;
					margin-right: 8px;
					margin-top: 9px;
				}
				.all-products ul li {
					float: left;
					width: 138px;
					height: 262px;
					overflow: hidden;
					text-align: center;
				}
				.all-products ul li .small-img {
					text-align: center;
					display: table-cell;
					vertical-align: middle;
					line-height: 90px;
					width: 100%;
					height: 100px;
					position: relative;
					float: left;
					margin-top: 23px;
				}
				.all-products ul li a img {
					vertical-align: middle;
					display: inline-block;
					width: auto;
					height: auto;
					max-height: 100px;
					max-width: 100px;
					float: none;
				}
				.all-products ul li a.b2c-other-info {
					text-align: center;
					float: left;
					height: 16px;
					line-height: 16px;
					margin-top: 13px;
				}

				.b2c-other-info .gwd-price {
					height: 17px;
					line-height: 17px;
					font-size: 16px;
					color: #E4393C;
					font-weight: 700;
					width: 100%;
					display: block;
				}
				.b2c-other-info .b2c-tle {
					height: 38px;
					line-height: 19px;
					margin-top: 8px;
					font-size: 12px;
					width: 138px;
					margin-left: 29px;
				}
				 .bjgext-mini-trend span {
					  float: left;
					  /*width: 100%;*/
					  text-align: center;
					  line-height: 36px;
					  color: #666;
					  font-size: 14px;
					}
					.bjgext-mini-trend .trend-error-info-mini {
					  position: absolute;
					  top: 37px;
					  left: 0px;
					  width: 100%;
					  background: #fff;
					  z-index: 99999999;
					  height: 268px;
					  display: none;
					  box-shadow: 0px 5px 15px 0 rgba(23,25,27,0.15);
					  border-radius: 0 0 4px 4px;
					  width: 460px;
					  border: 1px solid #ddd;
					  border-top: none;
					}
					.bjgext-mini-trend .error-p {
					  width: 100%;
					  float: left;
					  text-align: center;
					  margin-top: 45px;
					  font-size: 14px;
					  color: #666;
					}
					.bjgext-mini-trend .error-sp {
					  width: 95px;
					  margin: 110px auto;
					  height: 20px;
					  line-height: 20px;
					  text-align: center;
					  color: #000!important;
					  border: 1px solid #333;
					  border-radius: 5px;
					  display: block;
					  text-decoration: none!important;
					}
					.bjgext-mini-trend:hover .trend-error-info-mini {
					  display: block;
					}
					#coupon_box.coupon-box1 {
					  width: 525px;
					  height: 125px;
					  background-color: #fff;
					  border: 1px solid #e8e8e8;
					  border-top: none;
					  position: relative;
					  margin: 0px;
					  padding: 0px;
					  float: left;
					  display: block;
					}
					#coupon_box:after {
					  display: block;
					  content: "";
					  clear: both;
					}
					.idey_tmall #idey_minibar {
					  float: none;
					}


					.minicoupon_detail {
					  position: absolute;
					  top: 35px;
					  right: -1px;
					  height: 150px;
					  width: 132px;
					  display: none;
					  z-index: 99999999999;
					  background: #FFF7F8;
					  border: 1px solid #F95774;
					}
					#coupon_box:hover .minicoupon_detail {
					  display: block;
					}
					.minicoupon_detail img {
					  width: 114px;
					  height: 114px;
					  float: left;
					  margin-left: 9px;
					  margin-top: 9px;
					}
					.minicoupon_detail span {
					  font-size: 14px;
					  color: #F95572;
					  letter-spacing: 0;
					  font-weight: bold;
					  float: left;
					  height: 12px;
					  line-height: 14px;
					  width: 100%;
					  margin-top: 6px;
					  text-align: center;
					}
					.coupon-box1 * {
					  font-family: 'Microsoft YaHei',Arial,SimSun;
					}
					.coupon-icon {
					  float: left;
					  width: 20px;
					  height: 20px;
					  background: url('') 0px 0px no-repeat;
					  margin: 50px 8px 9px 12px;
					}
					#coupon_box .coupon-tle {
					  color: #FF3B5C;
					  font-size: 24px;
					  margin-right: 11px;
					  float: left;
					  height: 114px;
					  overflow: hidden;
					  text-overflow: ellipsis;
					  white-space: nowrap;
					  width: 375px;
					  line-height: 114px;
					  text-decoration: none!important;
					}
					#coupon_box .coupon-row{
						 color: #FF3B5C;
					  font-size: 12px;
					  margin-right: 11px;
					  float: left;
					  height: 60px;
					  overflow: hidden;
					  text-overflow: ellipsis;
					  white-space: nowrap;
					  width: 100%;
					  line-height: 60px;
					  text-decoration: none!important;
						text-align: center;
					}
					#coupon_box .coupon-tle * {
					  color: #f15672;
					}
					#coupon_box .coupon-tle span {
					  margin-right: 5px;
					  font-weight: bold;
					  font-size: 14px;
					}
					.coupon_gif {
					  background: url('') 0px 0px no-repeat;
					  float: right;
					  height: 20px;
					  width: 56px;
					  margin-top: 49px;
					}
					.click2get {
					  background: url('') 0px 0px no-repeat;
					  float: left;
					  height: 30px;
					  width: 96px;
					  margin-top: 43px;
					}
					.click2get span {
					  height: 24px;
					  float: left;
					  margin-left: 1px;
					}
					.c2g-sp1 {
					  width: 50px;
					  color: #FF3B5C;
					  text-align: center;
					  font-size: 14px;
					  line-height: 24px!important;
					}
					.c2g-sp2 {
					  width: 44px;
					  line-height: 24px!important;
					  color: #fff!important;
					  text-align: center;
					}
					div#idey_wishlist_div.idey_wishlist_div {
					  border-bottom-right-radius: 0px;
					  border-bottom-left-radius: 0px;
					}
					#qrcode{
						 float: left;
						width: 125px;
						margin-top:3px;
					}
					.elm_box{
						height: 37px;
					 border: 1px solid #ddd;
					 width: 460px;
					 line-height: 37px;
					 margin-bottom: 3px;
						 background-color: #ff0036;
							 font-size: 15px;
					}
					.elm_box span{
							width: 342px;
					text-align: center;
					display: block;
					float: left;
					color: red;
					color: white;
					}
				`;
		let styles = document.createElement('style')
		styles.type = 'text/css'
		styles.innerHTML = css;
		document.getElementsByTagName('head').item(0).appendChild(styles)
	},
	onclicks: (link) => {
		if (document.getElementById('redirect_form')) {
			var form = document.getElementById('redirect_form');
			form.action = '' + encodeURIComponent(link);
		} else {
			var form = document.createElement('form');
			form.action = '' + encodeURIComponent(link);
			form.target = '_blank';

			form.method = 'POST';
			form.setAttribute("id", 'redirect_form');
			document.body.appendChild(form);

		}
		form.submit();
		form.action = "";
		form.parentNode.removeChild(form);
	},
	getUrlType: (url) => {
		if (
			url.indexOf("//item.taobao.com/item.htm") > 0 ||
			url.indexOf("//detail.tmall.com/item.htm") > 0 ||
			url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 ||
			url.indexOf("//detail.tmall.hk/hk/item.htm") > 0 ||
			url.indexOf("//world.tmall.com") > 0 ||
			url.indexOf("//detail.liangxinyao.com/item.htm") > 0 ||
			url.indexOf("//detail.tmall.hk/item.htm") > 0
		) {
			return 'taobao_item';
		} else if (
			url.indexOf("//maiyao.liangxinyao.com/shop/view_shop.htm") > 0 ||
			url.indexOf("//list.tmall.com/search_product.htm") > 0 ||
			url.indexOf("//s.taobao.com/search") > 0 ||
			url.indexOf("//list.tmall.hk/search_product.htm") > 0
		) {
			return 'taobao_list';
		} else if (
			url.indexOf("//search.jd.com/Search") > 0 ||
			url.indexOf("//search.jd.com/search") > 0 ||
			url.indexOf("//search.jd.hk/search") > 0 ||
			url.indexOf("//search.jd.hk/Search") > 0 ||
			url.indexOf("//www.jd.com/xinkuan") > 0 ||
			url.indexOf("//list.jd.com/list.html") > 0 ||
			url.indexOf("//search.jd.hk/Search") > 0 ||
			url.indexOf("//coll.jd.com") > 0
		) {
			return 'jd_list';
		} else if (
			url.indexOf("//item.jd.hk") > 0 ||
			url.indexOf("//pcitem.jd.hk") > 0 ||
			url.indexOf("//i-item.jd.com") > 0 ||
			url.indexOf("//item.jd.com") > 0 ||
			url.indexOf("//npcitem.jd.hk") > 0 ||
			url.indexOf("//item.yiyaojd.com") > 0
		) {
			return 'jd_item';
		} else if (
			url.indexOf("//miaosha.jd.com") > 0
		) {
			return 'jd_miaosha';
		} else if (
			url.indexOf("//www.jd.com") > 0 ||
			url.indexOf("//jd.com") > 0
		) {
			return 'jd_index';
		} else if (
			url.indexOf("//jingfen.jd.com") > 0
		) {
			return 'jingfen';
		}
	},
	get_url: () => {
		item[index_num] = [];
		urls[index_num] = [];
		$("#J_goodsList li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var skuid = $(this).attr('data-sku');
				var itemurl = '//item.jd.com/' + skuid + '.html';
				if (skuid != undefined) {
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}
				}
			}
		})
		$("#plist li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var skuid = $(this).find('.j-sku-item').attr('data-sku');
				var itemurl = '//item.jd.com/' + skuid + '.html';
				if (skuid != undefined) {
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}
				}
			}
		})
		$(".m-aside .aside-bar li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var sku_c = $(this).attr('sku_c');
						if (sku_c == undefined) {
							var arr = [];
							var str = $(this).attr('onclick');
							arr = str.split(",");
							sku_c = tools.trim(arr[6].replace(/\"/g, ""));
							itemurl = '//item.jd.com/' + sku_c + '.html';
						}

					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}
				}
			}
		})
		$(".goods-chosen-list li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var arr = [];
						var str = $(this).attr('onclick');
						arr = str.split(",");
						var sku_c = tools.trim(arr[6].replace(/\"/g, ""));
						itemurl = '//item.jd.com/' + sku_c + '.html';
					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}
				}
			}

		})
		$(".may-like-list li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var arr = [];
						var str = $(this).attr('onclick');
						arr = str.split(",");
						var sku_c = tools.trim(arr[6].replace(/\"/g, ""));
						itemurl = '//item.jd.com/' + sku_c + '.html';
					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}
				}
			}
		})
		if (urls.length > 0 && urls[index_num].length > 0 && item[index_num].length > 0) {
			var u = urls[index_num].join(',');
			$.getJSON('', {
				act: 'itemlink',
				itemurl: u,
				num: index_num
			}, function(res) {
				if (res.type == 'success') {
					for (var i = 0; i < res.data.length; i++) {
						item[res.num][i].find("a").attr('data-ref', res.data[i].longUrl);
						item[res.num][i].find("a").attr('target', '');
						item[res.num][i].find("a").unbind("click");
						item[res.num][i].find("a").bind("click", function(e) {
							if ($(this).attr('data-ref')) {
								e.preventDefault();
								coupon.onclicks($(this).attr('data-ref'));

							}
						})
					}
				}
			})
		}
		index_num += 1;
	},
	get_taobao_id:(pagetype, url)=>{
			var return_data = '';
			if (pagetype == 'taobao_item') {
				var params = location.search.split("?")[1].split("&");
				for (var index in params) {
					if (params[index].split("=")[0] == "id") {
						var productId = params[index].split("=")[1];
					}
				}
				return_data = productId;
			}
			return return_data;
		},


	show: () => {
		var pagetype = coupon.getUrlType(location.href);
		if (pagetype == 'taobao_item') {
			coupon.initCss();
			var productId = coupon.get_taobao_id(pagetype, location.href);
			var couponurl = "" + encodeURIComponent(location.href) +
			'&itemid=' +
			productId;
		$.getJSON(couponurl, function(res) {
			var data = res.data;

			var couponArea = '<div class="idey-minibar_bg">';
			couponArea += '<div id="idey_minibar" class="alisite_page">';
			couponArea +=
				'<a class="idey_website"  id="idey_website_icon" target="_blank" href="">';
			couponArea += '<em class="setting-bg website_icon"></em></a>';
			couponArea += '<div  id="mini_price_history" class="minibar-tab">';



			couponArea +=
				'<span class="blkcolor1">:<span style="color:red" id="now_price">加载中...</span></span>';
			couponArea += '<div class="trend-error-info-mini" id="echart-box">';
			couponArea += '</div></div>';
			couponArea +=
				'<div style="flex: 1" id="idey_mini_compare" class="minibar-tab"><span style="color:red" id="min_price">加载中...</span></div>';
			couponArea += '<div style="flex: 1" id="idey_mini_remind" class="minibar-tab">';
			couponArea += '：<span style="color:red" id="coupon_price">加载中...</span>';

			couponArea += ' </div></div>';
			couponArea +=
				' <div class="idey-mini-placeholder idey-price-protect"></div><div id="promo_box"></div>';



			if (res.type == 'success') {
					couponArea +=
						'<a id="coupon_box" title="" class="coupon-box1" href="' +
						encodeURIComponent(location.href) + '&itemid='+productId+'">';
					couponArea += '<span class="coupon-icon"></span>';
					couponArea += ' <div class="coupon-tle"> <span>' + data.couponAmount +
						'元</span> <em class="coupon_gif"></em></div>';
					couponArea += '<div class="click2get"><span class="c2g-sp1">￥' + data.couponAmount +
						'</span><span class="c2g-sp2"></span></div>';
					couponArea += '</a>';

			} else {
				couponArea +=
					'<a id="coupon_box" title="" class="coupon-box1" >';
				couponArea += '<span class="coupon-icon"></span>';
				couponArea += ' <div class="coupon-tle"></div>';
				couponArea += '</a>';
			}


			couponArea += '</div>';
			if (data.alist.length > 0) {
				for (let i = 0; i < data.alist.length; i++) {
					couponArea +=
						'<div style="border:1px solid red;line-height:60px;color:red;font-size:20px;text-align:center;width:525px"><a href="' +
						data.alist[i].url + '" target="_blank">' + data.alist[i].name + '</a></div>'
				}
			}
            setTimeout(function(){
                if (location.href.indexOf("//detail.tmall") != -1) {
                    $(".tm-fcs-panel").after(couponArea);
                    $(".Promotion--root--3qHQalP").after(couponArea);
                } else {
                    $("ul.tb-meta").after(couponArea);
                }
                if (data.originalPrice) {
                    $("#now_price").html('¥' + data.originalPrice);
                }
                if (data.actualPrice) {
                    $("#coupon_price").html('¥' + data.actualPrice);
                }
            }, 1800 )
			 if(data.shortUrl){
					let hbm='<div style="position:fixed;width:170px;height:170px;right:28px;bottom:10px;z-index: 99999999;"><h1 style="color:red;font-size: 11px"></h1><div id="hbcode"></div></div>';
															$("body").append(hbm);
															$("#hbcode").qrcode({
																	render: "canvas", //也可以替换为table
																	width: 160,
																	height: 150,
																	text: data.shortUrl
																});
																}

		});
		} else if (pagetype == 'jd_item') {
			coupon.initCss();
			var productId = /(\d+)\.html/.exec(window.location.href)[1];
		var couponurl = "" + encodeURIComponent(location.href) +
			'&itemid=' + productId;
		$.getJSON(couponurl, function(res) {
			var data = res.data;
			if (!tools.GetQueryString('utm_campaign') && data) {
				window.location.href = '' + encodeURIComponent(data);
			}

		});
		var couponurls = "" + encodeURIComponent(location.href) +
			'&itemid=' + productId;

		$.getJSON(couponurls, function(res) {
			var data = res.data;

			var couponArea = '<div class="idey-minibar_bg">';
			couponArea += '<div id="idey_minibar" class="alisite_page">';
			couponArea +=
				'<a class="idey_website"  id="idey_website_icon" target="_blank" href="">';
			couponArea += '<em class="setting-bg website_icon"></em></a>';
			couponArea += '<div  id="mini_price_history" class="minibar-tab">';



			couponArea +=
				'<span class="blkcolor1">:<span style="color:red" id="now_price">加载中...</span></span>';
			couponArea += '<div class="trend-error-info-mini" id="echart-box">';
			couponArea += '</div></div>';
			couponArea +=
				'<div style="flex: 1" id="idey_mini_compare" class="minibar-tab"><span style="color:red" id="min_price">加载中...</span></div>';
			couponArea += '<div style="flex: 1" id="idey_mini_remind" class="minibar-tab">';
			couponArea += '：<span style="color:red" id="coupon_price">加载中...</span>';

			couponArea += ' </div></div>';
			couponArea +=
				' <div class="idey-mini-placeholder idey-price-protect"></div><div id="promo_box"></div>';



			if (res.type == 'success') {
				if (data.couponLinkType == 1) {
					couponArea +=
						'<a id="coupon_box" title="" class="coupon-box1" href="' + data.couponLink + '">';
					couponArea += '<span class="coupon-icon"></span>';
					couponArea += ' <div class="coupon-tle"> <span>' + data.couponAmount +
						'元</span> <em class="coupon_gif"></em></div>';
					couponArea += '<div class="click2get"><span class="c2g-sp1">￥' + data.couponAmount +
						'</span><span class="c2g-sp2">领取</span></div>';
					couponArea += '</a>';
				} else {

					couponArea +=
						'<a id="coupon_box" title="" class="coupon-box1" >';
					couponArea += '<span class="coupon-icon"></span>';
					couponArea += ' <div class="coupon-tle"> <span>立减' + data.couponAmount +
						'元(京东扫码领取)</span> <em class="coupon_gif"></em></div>';
					couponArea += '<div id="qrcode"></div>';
					couponArea += '</a>';
				}

			} else {

				couponArea +=
					'<a id="coupon_box" title="" class="coupon-box1" >';
				couponArea += '<span class="coupon-icon"></span>';
				couponArea += ' <div class="coupon-tle">此商品暂无红包</div>';

				couponArea += '</a>';


			}

			couponArea += '</div>';
			if (data.alist.length > 0) {
				for (let i = 0; i < data.alist.length; i++) {
					couponArea +=
						'<div style="border:1px solid red;line-height:60px;color:red;font-size:20px;text-align:center;width:525px"><a href="' +
						data.alist[i].url + '" target="_blank">' + data.alist[i].name + '</a></div>'
				}
			}
            setTimeout(function(){

			$(".summary-price-wrap").after(couponArea);
            },500)

			if (data.couponLink) {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.couponLink
				});

			} else if (data.item_link.shortUrl) {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.item_link.shortUrl
				});
			} else {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.item_link.longUrl
				});
			}
			if (data.item_link.originalPrice) {
				$("#now_price").html('¥' + data.item_link.originalPrice);
			}
			if (data.item_link.actualPrice) {
				$("#coupon_price").html('¥' + data.item_link.actualPrice);
			}
			if(data.hbcode !=''){
				let hbm='<div style="position:fixed;width:160px;height:160px;right:28px;bottom:50px;z-index:999"><h1 style="color:red;font-size: 11px">使用京东APP领劵购买此商品</h1><div id="hbcode"></div></div>';

										            $(".toolbar-qrcode").hide();
										            setInterval(function(){
										                $(".toolbar-qrcode").hide();
										            },100 )
										              $("body").append(hbm);
										                	$("#hbcode").qrcode({
																		render: "canvas", //也可以替换为table
																		width: 150,
																		height: 140,
																		text: data.hbcode
																	});
			}


		});
		} else if (pagetype == 'jd_list') {
			setInterval(coupon.get_url, 300);
		} else if (pagetype == 'jd_miaosha') {
			$(".seckill_mod_goodslist li").find("a").click(function(e) {
				if ($(this).attr('data-ref')) {
					e.preventDefault();
					coupon.onclicks($(this).attr('data-ref'));
				}
			})
			setInterval(coupon.get_miaosha, 300);
		}else if(pagetype=="jingfen"){
			$(document).ready(function(){
				setTimeout(function(){
					$(".btn-area").after("<div class='coupon_info' style='color: wheat;font-size: 24px;'>使用微信或者京东APP扫码更便捷</div>");
					$(".btn-area").after("<div class='coupon_code'></div>");
				 //   $(".btn-area").hide();
					$('.coupon_code').qrcode({
						render: "canvas", //也可以替换为table
						width: 400,
						height: 380,
						text: location.href
					});
				}, 1000 )
			});
		}
	},
	get_miaosha: () => {
		item[index_num] = [];
		urls[index_num] = [];
		$(".seckill_mod_goodslist li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				var skuid = $(this).attr('data-sku');
				var that = $(this);
				if (itemurl != '') {
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}
				}
			}
		})
		if (urls.length > 0 && urls[index_num].length > 0 && item[index_num].length > 0) {
			var u = urls[index_num].join(',');
			$.getJSON('', {
				act: 'itemlink',
				itemurl: u,
				num: index_num
			}, function(res) {
				if (res.type == 'success') {
					for (var i = 0; i < res.data.length; i++) {
						item[res.num][i].find("a").attr('data-ref', res.data[i].longUrl);
						item[res.num][i].find("a").attr('href', "javascript:void(0);");
						item[res.num][i].find("a").attr('target', '');
						//	item[res.num][i].find("a").unbind("click");

						item[res.num][i].find("a").click(function(e) {
							e.preventDefault();
							coupon.onclicks($(this).attr('data-ref'));
						})
					}
				}
			})
		}
		index_num += 1;
	},
};
	const tools={
		sleep:(time)=>{
			return new Promise((resolve) => setTimeout(resolve, time));
		},
		trim:(str)=>{
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		GetQueryString:(name)=>{
			let reg = eval("/" + name + "/g");
			let r = window.location.search.substr(1);
			let flag = reg.test(r);
			if (flag) {
				return true;
			} else {
				return false;
			}
		}
	};
	const video={
		isAuto:false,
		isAutoPlayer:'',
        isMobile:false,
		adVideoList:[],
        videoList:[],
		tm:null,
		adtm:null,
        flag:false,
		cur:{
			x: 0,
			y: 0
		},
		nx:0,
        ny:0,
        dx:0,
        dy:0,
        x:0,
        y:0,
        div2:0,
		playerParse:$("<div id='iframe-play-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>"),
		player:'',
		host:window.location.host,
		href:window.location.href,
		isVip:false,
		currentVideo:null,
		initCss:()=>{
			GM_addStyle(`
			#vbox {cursor:pointer; position:fixed; top:10px; left:5px; width:0px; z-index:2147483647; font-size:16px; text-align:left;}
			#vip_movie_box .item_text {}
			#vbox .item_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
			#vbox .item_text .img_box >img {width:20px; display:inline-block; vertical-align:middle;}
			#vbox .vip_mod_box_action {display:none; position:absolute; left:26px; top:0; text-align:center; background-color:#272930; border:1px solid gray;}
			#vbox .vip_mod_box_action li{border-radius:2px; font-size:12px; color:#DCDCDC; text-align:center; width:58px; line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
			#vbox .vip_mod_box_action li:hover{color:#E5212E; border:1px solid #E5212E;}
			#vbox li.selected{color:#E5212E; border:1px solid #E5212E;}
			#vbox .selected_text {margin-top:5px;}
			#vbox .selected_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
			#vbox .selected_text .img_box >img {width:20px; height:20px;display:inline-block; vertical-align:middle;}
			#vbox .vip_mod_box_selected {display:none;position:absolute; left:26px; top:0; text-align:center; background-color:#F5F6CE; border:1px solid gray;}
			#vbox .vip_mod_box_selected ul{overflow-y: auto;}
			#vbox .vip_mod_box_selected li{border-radius:2px; font-size:12px; color:#393AE6; text-align:center; width:95px; line-height:27px; float:left; border:1px dashed gray; padding:0 4px; margin:4px 2px;display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
			#vbox .vip_mod_box_selected li:hover{color:#E5212E; border:1px solid #E5212E;}
			#vbox .default-scrollbar-55678::-webkit-scrollbar{width:5px; height:1px;}
			#vbox .default-scrollbar-55678::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
			#vbox .default-scrollbar-55678::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
            .close { opacity: 0.3;}
            .close:hover {opacity: 1;}
            .close:before, .close:after {float: right;position: relative;right: 8%;top: 5px;content: ' ';height: 20px;width: 1px;background-color: white;}
            .close:before {transform: rotate(45deg);}
            .close:after {transform: rotate(-45deg);}
			`);
		},
        mvDown:()=>{
            video.flag = true;
            var touch;
            if (event.touches) {
                touch = event.touches[0];
            } else {
                touch = event;
            }
            video.cur.x = touch.clientX;
            video.cur.y = touch.clientY;
            video.dx = video.div2.offsetLeft;
            video.dy = video.div2.offsetTop;
        },
        mvMove:()=>{
            if (video.flag) {
                var touch;
                if (event.touches) {
                    touch = event.touches[0];
                } else {
                    touch = event;
                }
                video.nx = touch.clientX - video.cur.x;
                video.ny = touch.clientY - video.cur.y;
                video.x = video.dx + video.nx;
                video.y = video.dy + video.ny;
                video.div2.style.left = video.x + "px";
                video.div2.style.top = video.y + "px";
                GM_setValue('GM_IX', video.x);
                GM_setValue('GM_IY', video.y);
                //阻止页面的滑动默认事件
                document.addEventListener("touchmove", function() {
                    event.preventDefault();
                }, false);
            }
        },
        mvEnd:()=>{
           video.flag = false;
        },
		rvVideoAD:()=>{
			let i=0,setTm=setInterval(()=>{i>500?clearInterval(setTm):video.adVideoList.forEach((e,t)=>{e.duration!=e.currentTime&&e.setAttribute("src","")})},100);
		},
        rmVideo:()=>{
           try{let t=0,e=setInterval(()=>{t>500?clearInterval(e):video.videoList.forEach((t,e)=>{t.setAttribute("src",""),t.pause()})},100)}catch(t){}

        },
		autoSelect:()=>{
			setInterval(()=>{try{$(".panel-overlay").hide()}catch(e){}let e=location.href;if(e!=video.href){video.href=e;let r=video.isAutoPlayer+video.href;null==document.getElementById("iframe-player")?window.location.href=video.href:(video.rvVideoAD(),video.rmVideo(),$("#iframe-player").attr("src",""),video.player.empty(),video.player.append(video.playerParse),$("#iframe-player").attr("src",r),clearInterval(video.adtm))}},1e3);
		},
		autoPlayer:()=>{
			1==video.isAuto&&""!=video.isAutoPlayer&&null!=video.isAutoPlayer&&(setTimeout(()=>{for(let e of document.getElementsByTagName("video"))video.videoList.push(e)},1200),video.rvVideoAD(),video.rmVideo(),setTimeout(()=>{let e=video.isAutoPlayer+video.href;null==document.getElementById("iframe-player")&&(video.rvVideoAD(),video.player.empty(),video.player.append(video.playerParse)),$("#iframe-player").attr("src",e),clearInterval(video.adtm)},1800));
		

		},
		initHtml:()=>{
			let img =			`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRoQ+2ZPWgVQRDH/7/CWqOIYOFHFbRSjJhGMGDpByoIago70cqvUtQgdipWFqawMWghGIidhcHKQAJqEURBRfED1CCCjc3IPu4em31775J7d3m8cAtX3O7szP7nPzszx6EeH/T4+VUD6DaDTQbMbE+3D7MY+8Ckkw8BPFuMki7KDtUAuuh9Z3oZMtBljxY2X9eBwq4raWPNQEmOLKxm+TBgZqsknQ1dAVzNco+ZhWsm6ZakHZLC1mQyrZ5OX2RvzMxnSa8lzQJ/YwLzGDCze5JOeoI/gbVtAMxJ6vPW7wKnkr4qbEuaxccDcGWBsfNV0mjMmSGAg5LGA6XbgFehITPbLel5MN84ZAUAUjMPgWO+zZY7YGbvJW0OvRoB8EjSEW9+BhhIvOvCp0wGfPPbgZfpRAzATUnn56GEmJyLd39cBNxeF99FADTa42BskuQef4wDh9oB2CXpRbDpMPA4nTOz05LuBDLrgW+dAACGIkxfkHTDm/8DrMwEkBxgOskkqdwEcMAD4GLf3YF0PACOe+uFGMgA4Bj4EAAbAGbcXLQOmNklSdeCTRuBT2bWL+lNsLYfeFIRgH2SJgJ7GwCXYjMBrJb0K9jUiHEzG5F02VubA9b4skXvQMiAmW2VdFSSn24/As0kk1mJzeyppL3ewaaBnWY2K2mLNz8S5ueCAMLwz3q/DZxreweSe3BC0v1Ai7tkYXrsB96WwMBCAfQBv3MBJCD+SVrhaXaZ54z3PgUMhpYrZKCF7bbNnJk5BhwT6fghyW8thoGxigE4my6tXwemQlt5AGI1oamDSIFLmCuURiW5BOGPL8C7drGV206b2XdJ6yJKxoDhmPKCIeS61ZZClncxFgLAtcyxrnEwRmknDFQFIFYTWnJ/CVmoGgYSj7Z81OR86Lg7sOgPmnY6s0IpN4TyYrDb6zWAmoEOPVCHUIcO7Hh7/YemYxcWU7AMf3BkNGDF/FP9rkwGqjddkoWWv5Ql6V1yNXUdWHKXBwZ7noH/dP+HQNqheToAAAAASUVORK5CYII=`;
			let img2=`data:image/png;base64,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`
            let html1="", html2 = "",option="",checkbox="",selectoption="";
			let gmisauto=GM_getValue('ISAUTO');
			let gmisautoplayer=GM_getValue('ISAUTOPLAYER');
			if(gmisauto==1 && gmisauto !=undefined){
				checkbox="checked";
				video.isAuto=true;
			}
			if(gmisautoplayer && gmisautoplayer !=undefined){
				selectoption="selected";
				video.isAutoPlayer=gmisautoplayer;
			}


			playerList.forEach((v, k) => {
				let type_arr=v.type.split('-');
				type_arr.forEach((d,i)=>{
					if(video.isMobile){
						if(d==3){
							html1 += "<li title='" + v.name + "' data-k='" + k + "' data-t='1'>" + v.name + "</li>";
							if(v.url==gmisautoplayer){
								option+="<option value ='"+v.url+"' "+selectoption+">"+v.name+"</option>"
							}else{
								option+="<option value ='"+v.url+"' >"+v.name+"</option>"
							}
						}
					}else{
						if(d==1){
							html1 += "<li title='" + v.name + "' data-k='" + k + "' data-t='1'>" + v.name + "</li>";
							if(v.url==gmisautoplayer){
								option+="<option value ='"+v.url+"' "+selectoption+">"+v.name+"</option>"
							}else{
								option+="<option value ='"+v.url+"' >"+v.name+"</option>"
							}
						}
						if(d==2){
							html2 += "<li title='" + v.name + "' data-k='" + k + "' data-t='2'>" + v.name + "</li>";
						}
					}




				})

			});
            let iX = GM_getValue('GM_IX') ? GM_getValue('GM_IX') : (video.isMobile ? 35 : 10);
            let iY = GM_getValue('GM_IY') ? GM_getValue('GM_IY') : (video.isMobile ? 70 : 320);
           // let iW = t == 1 ? 150 : 300;

			let html = `<div id='vbox'  style="top:` + iY + `px; left:` + iX + `px;">
									<div class='item_text'>
										<div class="img_box" id="img_box_6667897iio"><img src='` + img + `' title='点击跳转到解析页面，线路随意选'/></div>
											<div class='vip_mod_box_action' >
												<div style='display:flex;'>
													<div style='padding:10px 0px; min-width:320px; max-height:550px; overflow-y:auto;'  class="default-scrollbar-55678">
														<div>
															<div style='font-size:16px; text-align:center; color:#E5212E; padding:5px 0px;'><b>解析线路[内嵌播放]</b><a href="#" class="close"/></div>
															<ul>
																` + html1 + `
																<div style='clear:both;'></div>
															</ul>
														</div>
														<div>
															<div style='font-size:16px; text-align:center; color:#E5212E; padding:5px 0px;'><b>解析线路[弹窗播放]</b></div>
															<ul>
															` + html2 + `
															<div style='clear:both;'></div>
															</ul>
														</div>
														<div>
															<div style='font-size:16px; text-align:center; color:#E5212E; padding:5px 0px;'><b>解析配置</b></div>
															<div ><span style='color:white' >自动解析：</span><input id='Isauto' type='checkbox' ` + checkbox + ` style='border: 1px solid #ccc;width: 15px;height: 15px;-webkit-appearance:auto'/></div>
															<div><span style='color:white' >解析线路：</span><select id='Isautoplayer' style=' color: white;border:1px solid #ccc;background:#ccc'>
																	 ` + option + `
																	</select>
																	</div>
															</ul>
														</div>
													</div>

												<div>

											</div>

										</div>

									</div>
                                     <div class="guanzhu" style="left: 350px;position: absolute;display:none;background:white"><img src="https://gitee.com/Bsutss/gitee.vip/raw/master/wx.png" style="width:100px"/>
                                     </p>
                                     <div style="text-align:center;font-size:12px">谢谢赞赏</div>
                                     </div>

								</div>
								`;


			$("body").append(html);
            video.div2 = document.getElementById("vbox");
		},
		closeAD:()=>{
            console.log(video.adVideoList);
			if (video.host == 'v.qq.com') {
				video.adtm=setInterval(() => {
					try {
						let advs = $('.txp_ad').find('txpdiv').find('video');
						advs.each(function(index, vobj) {
                            video.adVideoList.push(vobj);
							if (vobj.duration !== vobj.currentTime) {
								vobj.setAttribute('src', '');
							}
						})
					} catch (e) {}
				}, 10);

			} else if (video.host == 'm.v.qq.com' || video.host=='3g.v.qq.com') {
				video.adtm=setInterval(() => {
					try {
						$("#vipPosterContent").remove();//移除VIP电影收费弹窗
						if($('.txp_ad')[0] && !$('.txp_ad').hasClass("txp_none")){
							 $('video').each(function (i,vobj) {
							   vobj.setAttribute('src', null)
							 });

					   }
					   href = window.location.href
					} catch (e) {}
				}, 150);
			} else if (video.host == 'www.iqiyi.com') {
				try {
					unsafeWindow.rate = 0;
					unsafeWindow.Date.now = () => {
						return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
					}
					setInterval(() => {
						unsafeWindow.rate = 0;
					}, 600000);
				} catch (e) {}
				video.adtm=setInterval(() => {
					try {
						if (document.getElementsByClassName("cupid-public-time")[0] != null) {
							$(".skippable-after").css("display", "block");
							document.getElementsByClassName("skippable-after")[0].click();
						}
						$(".qy-player-vippay-popup").css("display", "none");
						$(".black-screen").css("display", "none");
					} catch (e) {}
				}, 500);


			}else if (video.host == 'm.iqiyi.com') {
					video.adtm=setInterval(() => {
					try {
						if(!$('.normal-public-time').is(":hidden")){
							 $('video').each(function (i,vobj) {
								 vobj.currentTime=888;
							 });
					   }
					   href = window.location.href
					} catch (e) {}
				}, 100);

			} else if (video.host == 'v.youku.com' || video.host == 'v-wb.youku.com' || video.host=='vku.youku.com') {
				window.onload = function() {
					try {
						if (!document.querySelectorAll('video')[0]) {
							setInterval(function() {
								document.querySelectorAll('video')[1].playbackRate = 16;
							}, 100)
						}
					} catch (e) {}
				}
				video.adtm=setInterval(() => {
					try {
						var H5 = $(".h5-ext-layer").find("div")
						if (H5.length != 0) {
							$(".h5-ext-layer div").remove();
							var btn = $(".control-left-grid .control-play-icon");
							if (btn.attr("data-tip") === "播放") {
								$(".h5player-dashboard").css("display", "block");
								btn.click();
								$(".h5player-dashboard").css("display", "none");
							}
						}
						var adv=$('.advertise-layer').find('div').find('video');
						if(adv.length>0){
							adv.each(function(index,vobj){
								if (vobj.duration !== vobj.currentTime) {
									vobj.currentTime = 500;
								}
							})
						}

						if ($(".kui-abortlayer-play-btn").html() === "解析播放") {
							$(".kui-abortlayer-play-btn").click();
						}
						$(".information-tips").css("display", "none");
					} catch (e) {}
				}, 50);

			}else if(video.host=='m.youku.com'){
				video.adtm=setInterval(() => {
					try {
						 if(!$('.x-advert').is(":hidden")){
							$('video').each(function (i,vobj) {
								 vobj.setAttribute('src', null)
							 });
						}
						$(".x-noticeshow").remove();
					} catch (e) {}
				}, 550);
			}else if (video.host == 'tv.sohu.com') {
				video.adtm=setInterval(() => {
					try {
						let vobject=$(".x-video-adv").find('video');
						vobject.each(function(index,vobj){
							 if (vobj.duration !=vobj.currentTime) {
								 vobj.currentTime = 500;
							 }
						})
						$(".x-video-adv").css("display", "none");
						$(".x-player-mask").css("display", "none");
						$("#player_vipTips").css("display", "none");
					} catch (e) {}
				}, 550);
			}else if (video.host == 'm.tv.sohu.com' || video.host=='pad.tv.sohu.com') {
				video.adtm=setInterval(() => {
					try {
						if(!$('.x-ad-panel').is(":hidden")){
							 $('video').each(function (i,vobj) {
								 vobj.playbackRate=5.5
							 });

					   }
					} catch (e) {}
				},550);
				video.adtm=setInterval(function() {
					$(document).on('click', '.list_juji li a', function(e) {
						e.preventDefault()
						window.location.href = $(this).attr('href');
					})
				}, 1000)
			}else if(video.host=='www.mgtv.com' || video.host=='w.mgtv.com'){
				video.adtm=setInterval(() => {
					try {
						if($('.as_fill_player')[0]){

												   $('video').each(function (i,vobj) {
													   vobj.currentTime = 1000;
												   });
											   }
						 $('.as-pause_container').css('display', 'none');
											$('.as_stages-wrapper').css('display', 'none');
											$('.m-agreement').remove();
					} catch (e) {}
				}, 550);
			}else if(video.host=='m.mgtv.com'){
				video.adtm=setInterval(() => {
					try {
						if(!$('.ad-time-area2').is(":hidden")){
							 $('video').each(function (i,vobj) {
								 vobj.setAttribute('src', null)
							 });

					   }
					} catch (e) {}
				}, 550);
			}else if(video.host=='www.le.com'){
				video.adtm=setInterval(() => {
					try {
						if($(".vdo_post_time")[0]){
							 $('video').each(function (i,vobj) {
								 vobj.setAttribute('src', null)
							 });
						}
					} catch (e) {}
				}, 550);
			}else if(video.host=='www.bilibili.com'){

            }
		},
		initEvent:()=>{
            video.div2.addEventListener("mousedown", function() {
                video.mvDown();

            }, false);
            video.div2.addEventListener("touchstart", function() {
                video.mvDown();
            }, false)
            video.div2.addEventListener("mousemove", function() {
                video.mvMove();
            }, false);
            video.div2.addEventListener("touchmove", function() {
               video.mvMove();
            }, false)
            document.body.addEventListener("mouseup", function() {
               video.mvEnd();
            }, false);
            video.div2.addEventListener("touchend", function() {
                video.mvEnd();
            }, false);
			$(".item_text").on("mouseover", () => {
				$(".vip_mod_box_action").show();
                $(".guanzhu").show();
			});
			$(".item_text").on("mouseout", () => {
				$(".vip_mod_box_action").hide();
                $(".guanzhu").hide();
			});


            $(".close").on("click",()=>{
                $(".vip_mod_box_action").hide();
                $(".guanzhu").hide();
            })
			$("#Isauto").change(function(){
				if($(this).is(":checked")) {
					GM_setValue('ISAUTO',1);
					video.isAuto=true;
				}else{
					GM_setValue('ISAUTO',2);
					video.isAuto=false;
				}
			});
			$("#Isautoplayer").change(function(){
				 GM_setValue("ISAUTOPLAYER",$(this).val());
				 video.isAutoPlayer=$(this).val();
                if(video.isAuto){
                      setTimeout(() => {
                          window.location.reload();
                      },200)

                }
			});
			$(".vip_mod_box_action li").click(function(){
				let k=$(this).attr('data-k');
				let type=$(this).attr('data-t');
				let link=playerList[k].url + video.href;
				if(type==1){
					if (document.getElementById("iframe-player") == null) {
						video.player.empty();
						video.player.append(video.playerParse);
					}
					$("#iframe-player").attr("src", link);
				}else{
					GM_openInTab(link, false);
				}

			})
		},

		initEnv:()=>{
			node.forEach((e,v)=>{
				if (e.url ==video.host) {
                    if(e.type==2){
                        video.isMobile=true;
                    }
					let node_arr=e.node.split('|');
					for(let i=0;i<node_arr.length;i++){
						if($(node_arr[i]).length){
							video.player=$(node_arr[i]);
							break;
						}

					}
					video.initHtml();
					video.initEvent();

				}
			})
		},
	};

	if(coupon.isRun()){
		coupon.show();


	}else{

		tools.sleep(200).then(() => {
			video.initCss();
			video.initEnv();
			video.closeAD();
			video.autoPlayer();
			video.autoSelect();




		})
	}

})();
