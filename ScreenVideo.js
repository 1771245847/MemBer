// ==UserScript==
// @name       Android手机全屏视频横屏播放
// @description  根据视频是横屏还是竖屏，在视频全屏时,自动选择横屏播放, 全屏横屏、仅适用于: Edge, 狐猴浏览器, Kiwi Browser, Iceraven Firefox 等安装脚本插件浏览器
// @version      1.0.2
// @author       1771245847
// @match       *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @license      MIT
// @namespace https://greasyfork.org/users/1182757
// ==/UserScript==  
//本脚本均来收集于互联网，请勿用于任何商业用途，仅供学习交流
/*jshint esversion: 8*/
(function () {
    'use strict';
    if (navigator.userAgent.search("Android") < 0) {
        //return;
    }
    //放开iframe全屏
    let iframes = document.getElementsByTagName("iframe");
    for (let iframe of iframes) {
        iframe.allowFullscreen = true;
    }
    //部分网站阻止视频操作层触摸事件传播，需要指定监听目标，默认是document
    //注意，对少数iframe内视频，广告插件或使此脚本不起作用
    let listenTarget = document;
    if (window.location.host === "m.youtube.com") {
        //整个网页就完全不刷新，内容却变来变去
        let timer;
        let observer;
        let lastLocation = "";
        //内容变化事件处理器
        let refresh = function () {
            let href = window.location.href;
            //观察网页内容变化，每次切换页面会触发多次，所以每个新地址只能执行一次
            if (!lastLocation) {
                //初次加载
                //通过元素页面【中断于->删除节点】发现#app是改变内容的父容器
                let target = document.getElementById("app");
                observer = new MutationObserver(refresh);
                observer.observe(target, {subtree: true, childList: true});
            } else if (href === lastLocation) {
                return;
            }
            //记录本次地址
            lastLocation = href;
            //每到一个新页面应该清除定时器，以免上一个页面尚未清除又添加了新的
            if (timer) clearInterval(timer);
            //youtube视频在脚本执行时还没加载，需要个定时器循环获取状态
            if (href.search("watch") >= 0) {
                timer = setInterval(() => {
                    //特定的视频操控层
                    let videos = document.getElementsByTagName("video");
                    let listenTargetArray = document.getElementsByClassName("player-controls-background");
                    if (videos.length > 0) {
                        let video = videos[0];
                        //非静音播放中
                        if (video.readyState > 1 && !video.paused && !video.muted) {
                            //视频已加载
                            listenTarget = listenTargetArray[0];
                            listen();
                            clearInterval(timer);
                        }
                    }
                }, 500);
            }
        };
        refresh();
    }
    //通用
    listen();
    if (GM_getValue("voiced") == null) {
        GM_setValue("voiced", true);
    }
    GM_registerMenuCommand("启用/关闭【触摸视频时取消静音】", () => {
        let voiced = GM_getValue("voiced");
        if (voiced) {
            if (confirm("目前【触摸视频时取消静音】已开启，是否要关闭？")) {
                GM_setValue("voiced", !voiced);
            }
        } else {
            if (confirm("目前【触摸视频时取消静音】已关闭，是否要开启？")) {
                GM_setValue("voiced", !voiced);
            }
        }
    });

    function listen() {
        if (listenTarget.tagName/*监听的是元素*/) {
            //做个标记方便调试
            listenTarget.setAttribute("listen_mark", true);
        }
        //对视频的查找与控制都是在每次touchstart后重新执行的
        //虽然这样更消耗性能，但是对不同的网站兼容性更强
        listenTarget.addEventListener("touchstart", (e) => {
            //为了代码逻辑在普通视频与iframe内视频的通用性，分别使用了clientX和screenY
            let startX;
            let startY;
            let endX;
            let endY;
            //多根手指不做响应
            if (e.touches.length === 1) {
                //在全屏时，不对边缘5%的区域做响应
                let screenX = e.touches[0].screenX;
                let screenY = e.touches[0].screenY;
                if (document.fullscreenElement) {
                    if (screenX < screen.width * 0.05 || screenX > screen.width * 0.95 ||
                        screenY < screen.height * 0.05 || screenY > screen.height * 0.95)
                        return;
                }
                //单指触摸，记录位置
                startX = Math.ceil(e.touches[0].clientX);
                startY = Math.ceil(screenY);
                endX = startX;
                endY = startY;
            } else return;
            let videoElement;
            //触摸的目标如果是视频或视频操控层，那他也是我们绑定手势的目标
            let target = e.target;
            //用于有操控层的网站，保存的是视频与操控层适当尺寸下的最大共同祖先节点，确认后需要在后代内搜索视频元素
            let biggestContainer;
            let targetWidth = target.clientWidth;
            let targetHeight = target.clientHeight;
            //所有大小合适的祖先节点最后一个为biggestContainer
            let suitParents = [];
            //用于判断是否含有包裹视频的a标签，需要禁止其被长按时呼出浏览器菜单
            let allParents = [];
            let temp = target;
            //用于抖音类网站，滚动高度超过阈值后，不再继续查找祖先
            let findAllSuitParent = false;
            //抖音类短视频网站，特点是视频操控层占据几乎整个屏幕
            let maybeTiktok = false;
            //用于短视频判断
            let scrollHeightOut = false;
            while (true) {
                temp = temp.parentElement;
                if (!temp/*或直接点击到html元素，他将没有父元素*/) {
                    return;
                }
                //allParents全部保存，用于判断是否存在a标签
                allParents.push(temp);
                if (!findAllSuitParent &&
                    temp.clientWidth > 0 &&
                    temp.clientWidth < targetWidth * 1.2 &&
                    temp.clientHeight > 0 &&
                    temp.clientHeight < targetHeight * 1.2) {
                    //用非全屏状态下scrollHeight来判断可以准确找到抖音类网站的合适视频容器
                    if (document.fullscreenElement) {
                        //全屏时视觉尺寸合适都可以用，youtube全屏就有滚动高度超出限制的元素
                        //suitParents保存适合的尺寸的祖先节点
                        suitParents.push(temp);
                    } else {
                        //非全屏时要判断一下滚动高度
                        if (temp.scrollHeight < targetHeight * 1.2) {
                            suitParents.push(temp);
                        } else {
                            findAllSuitParent = true;
                            scrollHeightOut = true;
                        }
                    }
                }
                //循环结束条件
                if (temp.tagName === "BODY" ||
                    temp.tagName === "HTML" ||
                    !temp.parentElement) {
                    //已找到所有符合条件的祖先节点，取最后一个
                    if (suitParents.length > 0) {
                        biggestContainer = suitParents[suitParents.length - 1];
                    }
                    //没有任何大小合适的祖先元素，且自身不是视频元素，那也肯定不是视频操控层
                    else if (target.tagName !== "VIDEO") {
                        return;
                    }
                    //gc
                    suitParents = null;
                    break;
                }
            }
            //当触摸的不是视频元素，可能是非视频相关组件，或视频的操控层
            if (target.tagName !== "VIDEO") {
                //尝试获取视频元素
                let videoArray = biggestContainer.getElementsByTagName("video");
                if (videoArray.length > 0) {
                    videoElement = videoArray[0];
                    //找到视频元素后，可以判断是否可能是短视频
                    //非全屏状态下，非iframe内视频，若视频操作层或视频占据大半的屏幕，判断为短视频
                    //tiktok没有视频控件，判断这个防止有页面的预览视频铺满了屏幕，这一项只能判断到没有框架的视频
                    if (!document.fullscreenElement &&
                        top === window &&
                        !videoElement.controls &&
                        scrollHeightOut &&
                        target.clientHeight > window.innerHeight * 0.8) {
                        maybeTiktok = true;
                    }
                    //如果是视频外很大的容器绝非我们想要的
                    //操作层除了短视频没见过高度高视频这么多的，大概率不是视频操控层
                    let _videoWidth = videoElement.clientWidth;
                    let _videoHeight = videoElement.clientHeight;
                    if (!maybeTiktok && targetHeight > _videoHeight * 1.5) {
                        //不是合适的操作层
                        return;
                    }
                    if (videoArray.length > 1) {
                        console.log("触摸位置找到不止一个视频。");
                    }
                } else {
                    //非视频相关组件
                    return;
                }
            }
            //触摸的是视频元素，则一切清晰明了
            else {
                videoElement = target;
            }
            //用于比较单击后，视频的播放状态，如果单击暂停，则恢复播放
            let playing = !videoElement.paused;
            //下面两个连通tiktok变量3个参数用于判断是否要执行touchmove事件处理器
            //小于30s当做预览视频，在网页上的视频列表可能存在，不要让他们影响网页滚动
            let sampleVideo = false;
            let videoReady = false;
            let videoReadyHandler = function () {
                videoReady = true;
                if (videoElement.duration < 30) {
                    sampleVideo = true;
                }
            };
            if (videoElement.readyState > 0) {
                videoReadyHandler();
            } else {
                videoElement.addEventListener("loadedmetadata", videoReadyHandler, {once: true});
            }
            //一个合适尺寸的最近祖先元素用于显示手势信息与全屏按钮
            let componentContainer = findComponentContainer();
            //指示器元素
            let notice;
            //视频快进快退量
            let timeChange = 0;
            //1表示右滑快进，2表示左滑快退，方向一旦确认就无法更改
            let direction;
            //优化a标签导致的长按手势中断问题（很多网站的视频列表的预览视频都是由a标签包裹）
            makeTagAQuiet();
            //禁止长按视频呼出浏览器菜单，为长按倍速做准备（没有视频框架的视频需要）
            if (!videoElement.getAttribute("disable_contextmenu")/*只添加一次监听器*/) {
                videoElement.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                });
                videoElement.setAttribute("disable_contextmenu", true);
            }
            //禁止图片长按呼出浏览器菜单和拖动（部分框架视频未播放时，触摸到的是预览图）
            if (target.tagName === "IMG") {
                target.draggable = false;
                if (!target.getAttribute("disable_contextmenu")) {
                    target.addEventListener("contextmenu", (e) => {
                        e.preventDefault();
                    });
                    target.setAttribute("disable_contextmenu", true);
                }
            }
            let haveControls = videoElement.controls;
            let longPress = false;
            //长按倍速定时器
            let rateTimer = setTimeout(() => {
                videoElement.playbackRate = 4;
                videoElement.controls = false;
                //禁止再快进快退
                target.removeEventListener("touchmove", touchmoveHandler);
                //显示notice
                notice.innerText = "x4";
                notice.style.display = "block";
                longPress = true;
                rateTimer = null;
            }, 800);
            //有些网站预览视频位置实际在屏幕之外，需要加上平移的数值
            let screenWidth = screen.width;
            let componentMoveLeft = componentContainer.offsetLeft;
            let moveNum = Math.floor(componentMoveLeft * 1.1 / screenWidth);
            //添加指示器元素
            if (componentContainer) {
                notice = document.createElement("div");
                let noticeWidth = 110;//未带单位，后面需要加单位
                let noticeHeight = 30;
                let noticeTop = Math.round(componentContainer.clientHeight / 6);
                let noticeLeft = Math.round(moveNum * screenWidth + componentContainer.clientWidth / 2 - noticeWidth / 2);
                notice.style.cssText = "position:absolute;display:none;z-index:99999;" +
                    "text-align:center;opacity:0.5;background-color:black;color:white;" +
                    "font:16px/1.8 sans-serif;letter-spacing:normal;border-radius:4px;";
                notice.style.width = noticeWidth + "px";
                notice.style.height = noticeHeight + "px";
                notice.style.left = noticeLeft + "px";
                notice.style.top = noticeTop + "px";
                componentContainer.appendChild(notice);
            } else {
                //怎么可能有视频没有div包着啊
                console.log("该视频没有可以用于给快进指示器定位的祖先元素。");
            }
            //滑动流畅的关键1，passive为false代表处理器内调用preventDefault()不会被浏览器拒绝
            //mdn：文档级节点 Window、Document 和 Document.body默认是true，其他节点默认是false
            target.addEventListener("touchmove", touchmoveHandler/*, {passive: false}*/);
            target.addEventListener("touchend", () => {
                setTimeout(touchendHandler, 0);
            }, {once: true});

            function makeTagAQuiet() {
                for (let element of allParents) {
                    if (element.tagName === "A" &&
                        !element.getAttribute("disable_menu_and_drag")) {
                        //禁止长按菜单
                        element.addEventListener("contextmenu", (e) => {
                            e.preventDefault();
                        });
                        //禁止长按拖动
                        element.draggable = false;
                        element.setAttribute("disable_menu_and_drag", true);
                        //没有长按菜单，用target="_blank"属性来平替
                        element.target = "_blank";
                        //不可能a标签嵌套a标签吧
                        break;
                    }
                }
                allParents = null;
            }

            function findComponentContainer() {
                let temp = videoElement;
                while (true) {
                    //寻找最近的有长宽数值的祖先节点
                    if (temp.parentElement.clientWidth > 0 &&
                        temp.parentElement.clientHeight > 0) {
                        return temp.parentElement;
                    } else {
                        temp = temp.parentElement;
                    }
                }
            }

            function getClearTimeChange(timeChange) {
                timeChange = Math.abs(timeChange);
                let minute = Math.floor(timeChange / 60);
                let second = timeChange % 60;
                return (minute === 0 ? "" : (minute + "min")) + second + "s";
            }

            function touchmoveHandler(moveEvent) {
                //触摸屏幕后，0.8s内如果有移动，清除长按定时事件
                if (rateTimer) {
                    clearTimeout(rateTimer);
                    rateTimer = null;
                }
                if (maybeTiktok || sampleVideo || !videoReady) {
                    return;
                }
                //滑动流畅的关键2
                moveEvent.preventDefault();
                if (moveEvent.touches.length === 1) {
                    //仅支持单指触摸，记录位置
                    let temp = Math.ceil(moveEvent.touches[0].clientX);
                    //x轴没变化，y轴方向移动也会触发，要避免不必要的运算
                    if (temp === endX) {
                        return;
                    } else {
                        endX = temp;
                    }
                    endY = Math.ceil(moveEvent.touches[0].screenY);
                    //console.log("移动到" + endX + "," + endY);
                }
                //由第一次移动确认手势方向，就不再变更
                //10个像素起
                if (endX > startX + 10) {
                    //快进
                    if (!direction) {
                        //首次移动，记录方向
                        direction = 1;
                    }
                    if (direction === 1) {
                        //方向未变化
                        timeChange = endX - startX - 10;
                    } else {
                        timeChange = 0;
                    }
                } else if (endX < startX - 10) {
                    //快退
                    if (!direction) {
                        //首次移动，记录方向
                        direction = 2;
                    }
                    if (direction === 2) {
                        //方向未变化
                        timeChange = endX - startX + 10;
                    } else {
                        timeChange = 0;
                    }

                } else if (timeChange !== 0) {
                    timeChange = 0;
                } else {
                    return;
                }
                if (notice.style.display === "none" /*已经显示了就不管怎么滑动了*/ &&
                    Math.abs(endY - startY) > Math.abs(endX - startX)) {
                    //垂直滑动不显示
                    timeChange = 0;
                    return;
                }
                //未到阈值不显示
                if (direction) {
                    notice.style.display = "block";
                    notice.innerText = (direction === 1 ? ">>>" : "<<<") + getClearTimeChange(timeChange);
                }
            }

            function touchendHandler() {
                if (GM_getValue("voiced")) {
                    videoElement.muted = false;
                }
                //所有非短视频自带的全视频区域的单击暂停，给他重新播放，手机不适合单击暂停，需要暂停的使用暂停按钮即可
                //带延迟是为了让网页自带的js先执行，videoElement.paused的状态才会判断准确
                setTimeout(() => {
                    if (playing && videoElement.paused && !maybeTiktok) {
                        videoElement.play();
                    }
                }, 200);
                //一般有chrome自带视频控件的就是没用框架的视频
                //需要替换全屏按钮，不然无法显示快进指示器
                //非长按后手指抬起时才添加全屏按钮
                if (!longPress && videoElement.controls && !document.fullscreenElement) {
                    let myFullscreenBtn = document.getElementById("myFullscreenBtn");
                    if (!myFullscreenBtn) {
                        let btn = document.createElement("div");
                        btn.style.cssText = "z-index:9999999;position:absolute;" +
                            "display:block;width:50px;" +
                            "background-color:black;color:white;opacity:0.5;" +
                            "padding:5px 2px;font:16px/1.2 sans-serif;font-weight:bold;text-align:center;" +
                            "box-sizing:border-box;border:2px solid white;white-space:normal;";
                        btn.innerText = "点我全屏";
                        btn.id = "myFullscreenBtn";
                        let divHeight = 50;
                        btn.style.height = divHeight + "px";
                        btn.style.top = Math.round(componentContainer.clientHeight / 2 - divHeight / 2 - 10) + "px";
                        btn.style.left = Math.round(moveNum * screenWidth + componentContainer.clientWidth * 5 / 7) + "px";
                        componentContainer.append(btn);
                        btn.addEventListener("touchstart", async function () {
                            clean();
                            await componentContainer.requestFullscreen();
                        });
                        //屏蔽原生全屏按钮
                        videoElement.controlsList = ["nofullscreen"];
                        setTimeout(clean, 2000);

                        function clean() {
                            let myFullscreenBtn = document.getElementById("myFullscreenBtn");
                            if (myFullscreenBtn) myFullscreenBtn.remove();
                        }
                    }
                }
                //滑动长按判断
                if (endX === startX) {
                    //长按
                    //console.log("长按");
                    if (rateTimer) {
                        //定时器也许已经执行，此时清除也没关系
                        clearTimeout(rateTimer);
                    }
                    if (longPress) {
                        //长按快进结束如果原本有控制器，则恢复
                        videoElement.controls = haveControls;
                        videoElement.playbackRate = 1;
                    }
                } else {
                    if (timeChange !== 0) {
                        //快进
                        videoElement.currentTime += timeChange;
                    }
                    //console.log("x轴移动" + (endX - startX));
                    //console.log("y轴移动" + (endY - startY));
                }
                target.removeEventListener("touchmove", touchmoveHandler);
                if (notice) notice.remove();
            }
        });
    }

    //全屏横屏模块
    //将浏览器锁定方向的方法改掉，防止网页自带的js执行，当此脚本执行时又把他改回来
    //这是因为遇到有网站锁定为any后，且后于此脚本执行，那么手机倒着拿就会直接退出全屏
    window.tempLock = screen.orientation.lock;
    let myLock = function () {
        console.log("网页自带js试图执行lock()")
    };
    screen.orientation.lock = myLock;
    //顶层窗口负责执行横屏，因为iframe可能开启了沙箱机制无法锁定方向并无法修改
    //使用油猴的变量监听，绕开iframe跨域限制
    if (top === window) {
        GM_setValue("doLock", false);
        GM_addValueChangeListener("doLock", async function (key, oldValue, newValue, remote) {
            if (document.fullscreenElement && newValue) {
                //恢复lock()
                screen.orientation.lock = window.tempLock;
                await screen.orientation.lock("landscape");
                //变向结束再次修改lock()
                screen.orientation.lock = myLock;
                GM_setValue("doLock", false);
            }
        });
    }
    //全屏后触发resize次数，如果有iframe，每个document可不是共用这个值
    let inTimes = 0;
    //利用window的resize事件监听全屏动作，监听document常用的fullscreenchange事件可能因为后代停止传播而捕获不到
    window.addEventListener("resize", () => {
        //resize事件或先于全屏事件触发，此时判断是否全屏将出错，所以得设置延迟
        setTimeout(fullscreenHandler, 500);
    });

    function fullscreenHandler() {
        //获取全屏元素，查找视频，判断视频长宽比来锁定方向
        let _fullscreenElement = document.fullscreenElement;
        if (_fullscreenElement) {
            //如果全屏元素是iframe，说明不是视频所在的document执行到这，记录也没用
            if (_fullscreenElement.tagName === "IFRAME") {
                return;
            }
            //inTimes==1可代表全屏
            inTimes++;
        } else if (inTimes > 0) {
            //此代码块可代表退出全屏
            inTimes = 0;
        } else {
            //退出全屏时多余的触发或者是其他与全屏无关的元素触发resize
            return;
        }
        if (inTimes !== 1) {
            return;
        }
        let videoElement;
        if (_fullscreenElement.tagName !== "VIDEO") {
            //最大的全屏元素不是视频本身，需要寻找视频元素
            let videoArray = _fullscreenElement.getElementsByTagName("video");
            if (videoArray.length > 0) {
                videoElement = videoArray[0];
                if (videoArray.length > 1) {
                    console.log("全屏元素内找到不止一个视频 ");
                }
            }
        } else videoElement = _fullscreenElement;
        //也可能不是视频在全屏
        if (videoElement) {
            let changeHandler = function () {
                //高度小于宽度，需要转向，landscape会自动调用陀螺仪
                if (videoElement.videoHeight < videoElement.videoWidth) {
                    //开启沙盒机制的iframe修改sandbox属性无效，需要顶层窗口调用方向锁定
                    GM_setValue("doLock", true);
                }
            };
            //视频未加载，在加载后再判断需不需要转向
            if (videoElement.readyState < 1) {
                videoElement.addEventListener("loadedmetadata", changeHandler, {once: true});
            } else {
                changeHandler();
            }
        }
    }
})();

//本脚本仅用于学习，切勿用于任何商业等其它用途