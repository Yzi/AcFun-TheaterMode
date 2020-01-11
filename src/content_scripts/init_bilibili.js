let config = {
    icon: function () {
        let video = document.querySelector("video");
        let pictureInPictureHidden = !document.pictureInPictureEnabled || video.disablePictureInPicture;

        //画中画
        let mini = document.createElement("div");
        mini.className = "mini-screen";
        mini.innerText = "画中画";
        mini.hidden = pictureInPictureHidden;
        mini.addEventListener("click", function (e) {
            if (pictureInPictureHidden) return;

            if (document.pictureInPictureElement)
                document.exitPictureInPicture();
            else
                video.requestPictureInPicture();
        });
        document.querySelector(".bilibili-player-video-top").appendChild(mini);
    },
    mini: function () {
        //画中画
        alreay.init(".bilibili-player-video-btn-widescreen", function () {
            let video = document.querySelector("video");

            //获取焦点
            let videoBottom = document.querySelector(".bilibili-player-video-control-bottom");
            videoBottom.click();

            config.icon();

            let playermode = "";
            //监听全屏
            alreay.watch("#bilibiliPlayer", ["class"], function (mutation) {
                let dataClass = mutation.target.getAttribute("class");
                //退出画中画
                if (playermode != dataClass && (dataClass.includes("mode-widescreen") || dataClass.includes("mode-webfullscreen") || dataClass.includes("mode-fullscreen")) && document.pictureInPictureElement) {
                    document.exitPictureInPicture();
                }
                playermode = dataClass;
            });

            //视频已经暂停但没有显示暂停图标
            video.addEventListener("leavepictureinpicture", function () {
                if (document.querySelectorAll(".video-state-pause").length <= 0 && video.paused) {
                    video.click();
                }
            });
        });
    },
    init: function () {
        //剧场模式
        let body = document.querySelector("body");

        //移动标题
        let lcon = document.querySelector(".l-con");
        let player = document.querySelector("#playerWrap");
        let viewbox = document.querySelector("#viewbox_report");
        let rcon = document.querySelector(".r-con");
        let danmukuBox = document.querySelector("#danmukuBox");
        let upinfo = document.querySelector("#v_upinfo") || document.querySelector(".members-info");

        chrome.storage.sync.get(null, function (properties) {
            if (!properties[PROPERTIES_KEY] || properties[PROPERTIES_KEY][DOMAIN_BILIBILI] != "false") {
                body.classList.toggle("theater-mode");
                alreay.init("img.up-face, .members-info img", function () {
                    lcon.insertBefore(player, viewbox);
                    rcon.insertBefore(danmukuBox, upinfo);
                });
            }
        });

        //快捷键
        document.addEventListener("keydown", function (event) {
            if (document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "INPUT") {
                return;
            }

            let ctrlKeyDown = event.ctrlKey || event.metaKey;
            //开启画中画
            if (event.keyCode == KEY_I) {
                if (!document.querySelector(".mini-screen")) {
                    config.icon();
                }
                document.querySelector(".mini-screen").click();
            }
            //全屏
            if (!ctrlKeyDown && event.keyCode == KEY_F) {
                //获取焦点
                let videoBottom = document.querySelector(".bilibili-player-video-control-bottom");
                videoBottom.click();
                let fullscreen = document.querySelector(".bilibili-player-video-btn-fullscreen");
                let event = new MouseEvent("mousedown", {
                    "view": window,
                    "bubbles": true
                });
                fullscreen.dispatchEvent(event);
            }
            //剧场模式
            if (!ctrlKeyDown && event.keyCode == KEY_T) {
                body.classList.toggle("theater-mode");
                if (player) {
                    if (player.nextElementSibling === viewbox) {
                        lcon.insertBefore(viewbox, player);
                        rcon.insertBefore(upinfo, danmukuBox);
                    }
                    else {
                        lcon.insertBefore(player, viewbox);
                        rcon.insertBefore(danmukuBox, upinfo);
                    }
                }
            }
            //关闭弹幕
            if (!ctrlKeyDown && event.keyCode == KEY_C) {
                document.querySelector(".bilibili-player-video-danmaku-switch input").click();
            }
        });


        //画中画
        config.mini();
    }
}

config.init();