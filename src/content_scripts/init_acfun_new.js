let config = {
    mini: function () {
        //画中画
        let setting = ".setting";
        alreay.init(setting, function () {
            let video = document.querySelector("video");
            let pictureInPictureHidden = !document.pictureInPictureEnabled || video.disablePictureInPicture;

            //获取焦点
            let event = new MouseEvent("mouseup", {
                "view": window,
                "bubbles": true
            });
            video.dispatchEvent(event);

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
            document.querySelector(".container-video").appendChild(mini);

            //监听全屏
            alreay.watch(".container-player", ["data-bind-attr"], function (mutation) {
                let dataBindAttr = mutation.target.getAttribute("data-bind-attr");
                //退出画中画
                if ((dataBindAttr == "screen" || dataBindAttr == "web") && document.pictureInPictureElement) {
                    document.exitPictureInPicture();
                }
            });

            //视频已经暂停但没有显示暂停图标
            video.addEventListener("leavepictureinpicture", function () {
                if (document.querySelectorAll(".control-btn-checked").length > 0 && video.paused) {
                    video.click();
                }
            });

            //视频hover
            video.addEventListener("mouseenter", function () {
                document.querySelector(".mini-screen").classList.add("hover-video")
            });
            video.addEventListener("mouseleave", function () {
                document.querySelector(".mini-screen").classList.remove("hover-video")
            });
        });

        alreay.init(".fullscreen-screen", function () {
            //全屏按钮
            var old_element = document.querySelector(".fullscreen-screen");
            var new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
            new_element.addEventListener("click", function (event) {
                toggleFullScreen(document.querySelector("#main"));
            });
        });
    },
    film: function () {
        let main = document.querySelector("#main");
        main.classList.add("dark-style");

        let rightColumn = document.querySelector(".right-column");
        rightColumn.classList.add("dark-style");

        let player = document.querySelector("#player");
        player.style.paddingBottom = 0;

        let moivePlayer = document.querySelector("#movie-player");
        let acPlayer = document.querySelector("#ACPlayer");
        moivePlayer.insertAdjacentElement("afterbegin", acPlayer);

        let containerPlayer = document.querySelector(".container-player");
        containerPlayer.classList.add("film-mode");

        alreay.init("#header", function () {
            let header = document.querySelector("#header");
            header.classList.add("dark-style");

            let btnFilmModel = document.querySelector(".btn-film-model .btn-span");
            btnFilmModel.setAttribute("data-bind-attr", true);

            let tipFilmModel = document.querySelector(".tip-film-model");
            tipFilmModel.innerText = "退出观影模式";
        });
    },
    init: function () {
        //剧场模式
        let body = document.querySelector("body");
        let film = document.querySelector(".btn-film-model");

        chrome.storage.sync.get(null, function (properties) {
            if (!properties[PROPERTIES_KEY] || properties[PROPERTIES_KEY][DOMAIN_ACFUN] != "false") {
                config.film();
                alreay.init(".btn-film-model", function () {
                    film = document.querySelector(".btn-film-model");
                    film.click();
                });
            }
            if (!properties[PROPERTIES_KEY] || properties[PROGRESS_KEY][DOMAIN_ACFUN] != "false") {
                body.classList.toggle("theater-mode-progress");
            }
        });

        // 全屏模式
        let bodyElem = document.querySelector("body");
        document.addEventListener("fullscreenchange", function (event) {
            if (document.fullscreenElement) {
                bodyElem.classList.add("theater-mode-fullscreen");
                bodyElem.classList.remove("theater-mode-progress");
            } else {
                bodyElem.classList.remove("theater-mode-fullscreen");
                bodyElem.classList.add("theater-mode-progress");
            }
        });

        //快捷键
        document.addEventListener("keydown", function (event) {
            if (document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "INPUT" ||
                document.activeElement.className == "editor edui-body-container") {
                return;
            }

            let ctrlKeyDown = event.ctrlKey || event.metaKey;
            //开启画中画
            if (event.keyCode == KEY_I) {
                document.querySelector(".mini-screen").click();
            }
            //全屏
            if (!ctrlKeyDown && event.keyCode == KEY_F) {
                if (!film.getAttribute("data-bind-attr")) {
                    config.film();
                }
                document.querySelector(".fullscreen-screen").click();
            }
            //剧场模式
            if (!ctrlKeyDown && event.keyCode == KEY_T) {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                film.click();
            }
            //关闭弹幕
            if (!ctrlKeyDown && event.keyCode == KEY_C) {
                document.querySelector(".danmaku-enabled").click();
            }
        });

        //画中画
        config.mini();
    }
}

config.init();