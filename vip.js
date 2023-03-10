// ==UserScript==
// @name        vip视频
// @namespace   注意，油猴脚本会提示跨域请求，请点击最下方的橙色按钮
// @match       https://movie.douban.com/subject/*
// @match       https://m.douban.com/movie/*
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @grant       unsafeWindow
// @connect     *
// @run-at      document-end
// @require     https://unpkg.com/artplayer@4.6.2/dist/artplayer.js
// @require     https://unpkg.com/hls.js@1.2.9/dist/hls.min.js
// @require     https://unpkg.com/artplayer-plugin-hls-quality/dist/artplayer-plugin-hls-quality.js
// @version     1.16
// @author      1771245847
// @description 打开豆瓣，搜索自己想看的电影，点击一键播放
// @license MIT
// ==/UserScript==

//finish for循环检测有资源的链接
//finish 开始搜索时先搜索所有资源的链接，选出返回最快的那个
//如果点击播放5秒内没反应就多点几下
//调试log

if (typeof window !== 'undefined') {
    window['artplayerPluginHlsQuality'] = artplayerPluginHlsQuality;
}


(function () {

    let mode = "debug"
    let videoName = ""
    var art = {} //播放器
    var seriesNum = 0
    let device = "pc"

    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        device = "mobile"
        //log_machine(`识别到是手机`)
    }

    function addScript() {
        let script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/xy-ui';

        document.head.appendChild(script);
    }


    //添加style样式
    function appendStyle(css) {
        let styleSheet = document.createElement("style")
        styleSheet.innerText = css
        document.head.appendChild(styleSheet)
    }

    //将html转为element
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
    //样式
    let css = `
.TalionNav{
        z-index:10;
    }

.liu-playContainer{
        width:100%;
        height:100%;
        background-color:#121212;
        position:fixed;
        top:0;
        z-index:11;
  }

.liu-closePlayer{
        float:right;
        margin-inline:10px;
        color:white;
  }

.video-selector{
        display:flex;
        flex-wrap:wrap;
        margin-top:1rem;
  }

.liu-selector:hover{
        color:#aed0ee;
        background-color:none;
  }

.liu-selector{
        color:black;
        cursor:pointer;
        padding:3px;
        margin:5px;
        border-radius:2px;
  }
.liu-sourceButton{
        margin-inline:5px;
  }

.liu-rapidPlay{
        color: #007722;
  }


.liu-light{
        background-color:#7bed9f;
  }
  .liu-btn {
    width: 6.5em;
    height: 2em;
    margin: 0.5em;
    background: #41ac52;
    color: white;
    border: none;
    border-radius: 0.625em;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .liu-btn:hover {
    color: #41ac52;
  }

  .liu-btn:after {
    content: '';
    background: white;
    position: absolute;
    z-index: -1;
    left: -20%;
    right: -20%;
    top: 0;
    bottom: 0;
    transform: skewX(-45deg) scale(0, 1);
    transition: all 0.5s;
  }

  .liu-btn:hover:after {
    transform: skewX(-45deg) scale(1, 1);
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
  }
  xy-button{
    margin:0em 1em 0em 0em;
    height:1.5em;
    cursor:pointer;
  }
  .playSpace{
    display: grid;
    height:500px;
    grid-template-rows: 1fr;
    grid-template-columns: 70% 30%;
    grid-row-gap:0px;
    grid-column-gap:0px;
  }
  .series-select-space::-webkit-scrollbar {display:none}
  .series-select-space{
    height:500px;
  }
  .artplayer-app{
  height:500px;
  }
  @media screen and (max-width: 1025px) {
  .playSpace{
    display: grid;
    height:700px;
    grid-template-rows: 1fr 1fr;
    grid-template-columns:1fr;
    grid-row-gap:0px;
    grid-column-gap:0px;
  }
  .series-select-space{
    height:200px;
  }
  .artplayer-app{
    height:400px;
  }
}
`

    //搜索源
    let searchSource = [
        // {"name":"闪电资源","searchUrl":"https://sdzyapi.com/api.php/provide/vod/"},//不太好，格式经常有错
        //{ "name": "卧龙资源", "searchUrl": "https://collect.wolongzyw.com/api.php/provide/vod/" }, 非常恶心的广告
        { "name": "红牛资源", "searchUrl": "https://www.hongniuzy2.com/api.php/provide/vod/from/hnm3u8/" },
        { "name": "光速资源", "searchUrl": "https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8/" },
        { "name": "ikun资源", "searchUrl": "https://ikunzyapi.com/api.php/provide/vod/from/ikm3u8/at/json/" },
        // {"name":"天空资源","searchUrl":"https://m3u8.tiankongapi.com/api.php/provide/vod/from/tkm3u8/"},//有防火墙，垃圾
        { "name": "非凡资源", "searchUrl": "http://cj.ffzyapi.com/api.php/provide/vod/" },
        // { "name": "飞速资源", "searchUrl": "https://www.feisuzyapi.com/api.php/provide/vod/" },//经常作妖或者没有资源

        { "name": "高清资源", "searchUrl": "https://api.1080zyku.com/inc/apijson.php/" },

        { "name": "量子资源", "searchUrl": "https://cj.lziapi.com/api.php/provide/vod/" },
        // { "name": "8090资源", "searchUrl": "https://api.yparse.com/api/json/m3u8/" },垃圾 可能有墙
        { "name": "百度云资源", "searchUrl": "https://api.apibdzy.com/api.php/provide/vod/" },
        //{ "name": "酷点资源", "searchUrl": "https://kudian10.com/api.php/provide/vod/" },
        //{ "name": "淘片资源", "searchUrl": "https://taopianapi.com/home/cjapi/as/mc10/vod/json/" },
        { "name": "ck资源", "searchUrl": "https://ckzy.me/api.php/provide/vod/" },
        { "name": "快播资源", "searchUrl": "https://caiji.kczyapi.com/api.php/provide/vod/" },
        { "name": "海外看资源", "searchUrl": "http://api.haiwaikan.com/v1/vod/" }, //说是屏蔽了所有中国的IP，所以如果你有外国的ip可能比较好
        { "name": "68资源", "searchUrl": "https://caiji.68zyapi.com/api.php/provide/vod/" },
        { "name": "188资源", "searchUrl": "https://www.188zy.org/api.php/provide/vod/" }

        //https://caiji.kczyapi.com/api.php/provide/vod/

        // {"name":"鱼乐资源","searchUrl":"https://api.yulecj.com/api.php/provide/vod/"},//速度太慢
        // {"name":"无尽资源","searchUrl":"https://api.wujinapi.me/api.php/provide/vod/"},//资源少

    ];

    //自动log
    let log_machine = (function (mode) {
        if (mode == "debug") {
            return function (log) {
                console.log(log)
            }
        } else {
            return function (log) {

            }
        }
    })(mode)


    function giveMessage(message) {
        //window.XyMessage.info(message)
        //log_machine(unsafeWindow)
        unsafeWindow.XyMessage.info(message)

    }

    //播放按钮
    //使用类来规范代码
    class playButtonv3 {
        constructor() {
            this.element = htmlToElement(`<xy-button type="primary">一键播放</xy-button>`)
            this.element.onclick = async () => {
                this.element.loading = true
                giveMessage("正在搜索")
                for (let item of searchSource) {

                    let playList = await search(item.searchUrl, getVideoNamev2())
                    if (playList != 0) {
                        this.element.loading = false
                        let ui = new UI(playList)
                        ui.init()
                        break
                    }
                }
            }
        }

        mount() {
            if (device == "pc") {
                document.querySelector("h1").appendChild(this.element)
            } else {
                document.querySelector(".sub-original-title").appendChild(this.element)
            }


        }

    }

    //影视源选择按钮
    class SourceButton {
        constructor(item) {
            this.element = htmlToElement(`<xy-button style="color:#a3a3a3" type="dashed">${item.name}</xy-button>`)
            this.element.onclick = () => {
                switchUrl(item.playList[seriesNum].url)
                document.querySelector(".series-select-space").remove()
                let series_container = new seriesContainer(item.playList)
                series_container.init()
            }
        }
        //sources 是[{name:"..资源",playList:[{name:"第一集",url:""}]}]

    }

    //资源列表的container
    class SourceListContainer {
        constructor(sources) {
            this.element = document.querySelector(".sourceButtonList")
            this.sources = sources

        }

        //渲染资源列表
        async renderList() {

            let videoName = getVideoNamev2()

            let filteredList = await this.filter(videoName)
            this.initList(filteredList)
            giveMessage("正在对资源进行测速")
            let sortedList = await this.sort(filteredList)
            this.element.innerHTML = ""
            for (let item of sortedList) {
                let button = new SourceButton(item)
                this.element.appendChild(
                    button.element
                )
            }
            unsafeWindow.XyMessage.success("测速完成，排序由快到慢")
        }
        initList(sources) {
            for (let item of sources) {
                let button = new SourceButton(item)
                this.element.appendChild(
                    button.element
                )
            }
        }

        //搜索后对列表进行过滤
        async filter(name) {
            let reslist = []
            for (let item of this.sources) {

                let playList = await search(item.searchUrl, name)
                if (playList == 0) continue
                reslist.push({ name: item.name, playList: playList })
            }
            return reslist
        }

        //对列表添加速度
        async sort(sources) {
            let sortedSource = []
            for (let item of sources) {
                let tsList = await downloadM3u8(item.playList[0].url)
                let speed = 0
                if (tsList.length == 0) {
                    log_machine(`没有找到下载链接，请检查`)
                } else {
                    speed = await testSpeed(tsList)
                }
                sortedSource.push({ ...item, "speed": speed })
            }
            sortedSource.sort((a, b) => {
                return b.speed - a.speed;//从大到小排序
            })
            log_machine("排序完成...")
            log_machine(sortedSource)

            return sortedSource
        }

    }


    //剧集选择器
    class seriesButton {
        constructor(name, url, index) {
            this.element = htmlToElement(`<xy-button style="color:#a3a3a3" type="flat">${name}</xy-button>`)
            this.element.onclick = () => {
                seriesNum = index
                switchUrl(url)
                document.querySelector(".show-series").innerText = `正在播放第${index + 1}集`
            }
        }
    }

    //剧集选择器的container
    class seriesContainer {
        constructor(playList) {
            this.element = htmlToElement(`<div class="series-select-space" style="display:flex;flex-wrap:wrap;overflow:scroll;align-content: start;"></div>`)
            this.playList = playList
        }
        init() {
            for (let [index, item] of this.playList.entries()) {
                let button = new seriesButton(item.name, item.url, index)
                this.element.appendChild(button.element)
            }
            document.querySelector(".playSpace").appendChild(this.element)
        }
    }

    class UI {
        constructor(playList) {
            this.element = htmlToElement(`
            <div class="liu-playContainer">
                <a class="liu-closePlayer">关闭界面</a>
                <div class="sourceButtonList"><xy-loading>正在测速排序中...</xy-loading></div>
  <div class="playSpace" style="margin-top:1em;width:100%">
    <div class="artplayer-app" ></div>

  </div>

                <div class="show-series" style="color:#a3a3a3"></div>
                <p style="color:#a3a3a3">默认会播放第一个搜索到的资源，如果无法播放请尝试切换其他资源，与此同时脚本正在疯狂测速，测速完成后排序第一的资源即为最快</p>
                <p style="color:#a3a3a3" >选集后会出现卡顿，点击播放按钮或拖动一下进度条即可恢复</p>
                <a href="https://upload-images.jianshu.io/upload_images/25392849-95e78344c931f4b7.png" target="_blank" style="color:#4aa150">赞赏 👍 </a>
            </div>
        `)
            this.playList = playList
        }
        async init() {
            document.body.appendChild(this.element)
            let button = document.querySelector(".liu-closePlayer")
            //
            button.onclick = () => {
                this.element.remove()
            }
            //第n集开始播放
            log_machine(this.playList[seriesNum].url)
            initArt(this.playList[seriesNum].url)
            let series_container = new seriesContainer(this.playList)
            series_container.init()
            let sources_container = new SourceListContainer(searchSource)
            sources_container.renderList()

        }
    }



    // function getResolution(art){
    //   function update(){
    //     art.controls.add({
    //             position: 'right',
    //             html: document.querySelector("video").videoHeight+"P",
    //             style: { padding: '0 10px' },
    //             });
    //   }
    //   art.on("url",update)
    // }



    //初始化播放器
    function initArt(url) {
        art = new Artplayer({
            container: ".artplayer-app",
            url: url,
            setting: true,
            fullscreen: true,
            airplay: true,
            playbackRate: true,
            autoSize: true,
            customType: {
                m3u8: function (video, url) {
                    // Attach the Hls instance to the Artplayer instance
                    if (art.hls) art.hls.destroy();
                    art.hls = new Hls();
                    art.hls.loadSource(url);
                    art.hls.attachMedia(video);
                    if (!video.src) {
                        video.src = url;
                    }
                },
            },

        });
        art.on('ready', () => {
            art.controls.add({
                name: "resolution",
                html: "分辨率",
                position: "right",
            });
            art.controls["resolution"].innerText = document.querySelector("video").videoHeight + "P"

        });
        art.on("video:loadedmetadata", () => {
            //console.log(art.controls)
            art.controls["resolution"].innerText = document.querySelector("video").videoHeight + "P"
        })
        log_machine(art)
    }

    function switchUrl(url) {
        art.switchUrl(url)
        if (art.video.src != url) {
            art.video.src = url;
        }
    }



    //获取豆瓣影片名称
    //v2:新的获取方式，看起来简洁多了
    function getVideoNamev2() {
        if (device == "mobile") {
            videoName = document.querySelector(".sub-title").innerText
            return videoName
        }
        videoName = document.title.slice(0, -5)
        return videoName

    }

    function getVideoYear(outYear) {
        let yearEqual = 0;
        try {
            if (device == "mobile") {
                yearEqual = document.querySelector(".sub-original-title").innerText.includes(outYear);
            } else {
                yearEqual = document.querySelector(".year").innerText.includes(outYear)
            }

        } catch (e) {
            log_machine("获取年份失败，请检查！");
        }
        return yearEqual;
    }

    //到电影网站搜索电影
    function search(url, videoName) {
        log_machine(`正在搜索${videoName}`)
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: encodeURI(`${url}?ac=detail&wd=${videoName}`),
                timeout: 3000,
                onload: function (r) {
                    try {
                        // log_machine(`搜索结果为${JSON.stringify(r)}`)
                        let response = JSON.parse(r.responseText)
                        resolve(handleResponse(response, videoName));
                    } catch (e) {
                        log_machine("垃圾资源，解析失败了，可能有防火墙")
                        log_machine(e)
                        resolve(0)
                    }

                },
                onerror: function (error) {
                    resolve(0)
                },
                ontimeout: function (out) {
                    resolve(0)
                }
            });
        });
    }

    //处理搜索到的结果:从返回结果中找到对应片子
    function handleResponse(r) {
        if (r.list.length == 0) {
            log_machine("未搜索到结果")
            return 0
        }
        let video = {};
        let found = false
        for (let item of r.list) {

            log_machine("正在对比剧集年份")
            let yearEqual = getVideoYear(item.vod_year)
            if (yearEqual === 0) return 0
            if (yearEqual) {
                video = { ...item }
                found = true
                break
            }
        }
        if (found == false) {
            log_machine("没有找到匹配剧集的影片，怎么回事哟！")
            return 0
        }

        let videoName = video.vod_name;
        let playList = video.vod_play_url.split("$$$").filter(str => str.includes("m3u8"));
        if (playList.length == 0) {
            log_machine("没有m3u8资源，无法测速，无法播放")
            return 0
        }
        playList = playList[0].split("#");
        playList = playList.map(str => {
            let index = str.indexOf("$");
            return { "name": str.slice(0, index), "url": str.slice(index + 1) }
        })

        return playList
    }

    //获取下载的内容
    function gm_download(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: encodeURI(url),
                timeout: 3000,
                onload: function (r) {
                    resolve(r.response)
                },
                onerror: function (e) {
                    resolve("html")
                },
                ontimeout: function (o) {
                    resolve("html")
                }
            })
        })
    }


    //下载m3u8的内容，返回片段列表
    async function downloadM3u8(url) {
        let domain = url.split("/")[0]
        let baseUrl = url.split("/")[2]
        let downLoadList = []
        log_machine(`正在获取index.m3u8 ${url}`)
        let downloadContent = await gm_download(url)

        if (downloadContent.includes("html")) {
            log_machine(`下载失败，被反爬虫了`)
            return []
        }

        if (downloadContent.includes("index.m3u8")) { //如果是m3u8地址
            let lines = downloadContent.split("\n")
            for (let item of lines) {
                if (/^[#\s]/.test(item)) continue //跳过注释和空白行
                if (/^\//.test(item)) {
                    downLoadList = await downloadM3u8(domain + "//" + baseUrl + item)
                } else if (/^(http)/.test(item)) {
                    downLoadList = await downloadM3u8(item)
                } else {
                    downLoadList = await downloadM3u8(url.replace("index.m3u8", item))
                }
            }
        } else {//如果是ts地址
            let lines = downloadContent.split("\n")
            for (let item of lines) {
                if (/^[#\s]/.test(item)) continue//跳过注释和空白行
                if (/^(http)/.test(item)) {//如果是http直链
                    downLoadList.push(item)
                } else if (/^\//.test(item)) { //如果是绝对链接
                    downLoadList.push(domain + "//" + baseUrl + item)
                } else {
                    downLoadList.push(url.replace("index.m3u8", item))
                }
            }
        }
        log_machine(`测试列表为${downLoadList}`)
        return downLoadList

    }



    //测试下载速度
    async function testSpeed(list) {
        let downloadList = list.slice(0, 5)
        let downloadSize = 0
        let startTime = (new Date()).getTime();


        for (item of downloadList) {
            log_machine("正在下载" + item)
            let r = await makeGetRequest(item)
            log_machine(r)
            downloadSize += r.byteLength / 1024
        }

        let endTime = (new Date()).getTime();
        let duration = (endTime - startTime) / 1000
        let speed = downloadSize / duration
        if (speed == NaN) speed = 0;
        log_machine(`速度为${speed}KB/s`)
        return speed
    }

    //将GM_xmlhttpRequest改造为Promise
    function makeGetRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                timeout: 5000,
                url: encodeURI(url),
                responseType: "arraybuffer",
                onload: function (r) {
                    resolve(r.response);
                },
                onerror: function (error) {
                    resolve({ "byteLength": 0 })
                },
                ontimeout: function (out) {
                    log_machine("不行啊，速度太慢了")
                    resolve({ "byteLength": 0 })
                }
            });
        });
    }


    //将源根据速度进行排序
    async function sortSource() {
        log_machine("进入排序...")
        giveMessage("正在测速，随后排序会变动")
        let sortedSource = []
        let videoName = getVideoNamev2()
        for (let item of testSearchSource) {
            log_machine(`正在搜索${item.name}`)
            let playList = await search(item.searchUrl, videoName)
            if (playList == 0) continue;
            log_machine(`测速中...正在下载${item.name}`)
            let tsList = await downloadM3u8(playList[0].url)
            let speed = 0
            if (tsList.length == 0) {
                log_machine(`没有找到下载链接，请检查`)
            } else {
                speed = await testSpeed(tsList)
            }

            log_machine(`速度为${speed}`)
            sortedSource.push({ ...item, "speed": speed })
        }
        sortedSource.sort((a, b) => {
            return b.speed - a.speed;//从大到小排序
        })
        log_machine("排序完成...")
        for (let item of sortedSource) {
            log_machine(`${item.name}speed:${item.speed}`)
        }
        return sortedSource
    }


    async function main() {
        appendStyle(css) //添加css
        let playbuttonv3 = new playButtonv3()
        playbuttonv3.mount()
    }

    addScript()
    main()


})()

