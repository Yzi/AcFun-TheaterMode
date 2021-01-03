let config = {
    init: function () {
        //剧场模式
        let body = document.querySelector("body");

        //移动标题
        let lcon = document.querySelector(".l-con");
        let player = document.querySelector("#playerWrap");
        let viewbox = document.querySelector("#viewbox_report");

        chrome.storage.sync.get(null, function (properties) {
            if (!properties[PROPERTIES_KEY] || properties[PROPERTIES_KEY][DOMAIN_BILIBILI] != "false") {
                body.classList.toggle("theater-mode");
                alreay.init(".u-face img, .members-info img", function () {
                    lcon.insertBefore(player, viewbox);
                });
            }
        });

        //获取焦点
        alreay.init(".bilibili-player-video-btn-widescreen", function () {
            //获取焦点
            let videoBottom = document.querySelector(".bilibili-player-video-control-bottom");
            videoBottom.click();
        });

        //快捷键
        document.addEventListener("keydown", function (event) {
            if (document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "INPUT") {
                return;
            }

            let ctrlKeyDown = event.ctrlKey || event.metaKey;
            //开启画中画
            if (event.key == KEY_I) {
                document.querySelector(".bilibili-player-video-btn-pip").click();
            }
            //全屏
            if (!ctrlKeyDown && event.key == KEY_F) {
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
            if (!ctrlKeyDown && event.key == KEY_T) {
                body.classList.toggle("theater-mode");
                if (player) {
                    if (player.nextElementSibling === viewbox) {
                        lcon.insertBefore(viewbox, player);
                    }
                    else {
                        lcon.insertBefore(player, viewbox);
                    }
                }
            }
            //关闭弹幕
            if (!ctrlKeyDown && event.key == KEY_C) {
                document.querySelector(".bilibili-player-video-danmaku-switch input").click();
            }
            //禁音
            if (!ctrlKeyDown && event.key == KEY_M) {
                document.querySelector(".bilibili-player-iconfont-volume").click();
            }
        });
    }
}

config.init();