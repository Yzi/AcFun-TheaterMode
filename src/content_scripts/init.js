//检查DOM时间间隔(秒)
let sec = 500;
let KEY_F = 70;
let KEY_I = 73;
let KEY_T = 84;

let alreay = {
    init: function (i, f) {
        let interval = window.setInterval(function () {
            if (document.querySelectorAll(i).length > 0) {
                window.clearInterval(interval);
                f();
            }
        }, sec);
    },
    watch: function (i, a, f) {
        let observer = new MutationObserver(function (mutationsList) {
            for (let mutation of mutationsList) {
                f(mutation);
            }
        });
        observer.observe(document.querySelector(i), {
            attributes: true,
            attributeFilter: a
        });
    }
}

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

            let mini = document.createElement("div");
            mini.className = "mini-screen";
            mini.innerText = "画中画";
            mini.hidden = pictureInPictureHidden;
            mini.addEventListener("click", function (e) {
                //开启画中画
                if (!pictureInPictureHidden)
                    video.requestPictureInPicture();
            });
            document.querySelector(".container-video").appendChild(mini);

            //监听全屏
            alreay.watch(".container-player", ["data-bind-attr"], function (mutation) {
                let dataBindAttr = mutation.target.getAttribute('data-bind-attr');
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
    },
    init: function () {
        //剧场模式
        let body = document.querySelector("body");
        body.classList.toggle("theater-mode");

        //移动标题
        let main = document.querySelector("#main");
        let head = document.querySelector("section.head");
        let player = document.querySelector("section.player");
        main.insertBefore(player, head);

        //快捷键
        document.addEventListener("keydown", function (event) {
            let ctrlKeyDown = event.ctrlKey || event.metaKey;
            //开启画中画
            if (event.keyCode == KEY_I) {
                document.querySelector(".mini-screen").click();
            }
            //全屏
            if (!ctrlKeyDown && event.keyCode == KEY_F) {
                document.querySelector(".fullscreen-screen").click();
            }
            //剧场模式
            if (!ctrlKeyDown && event.keyCode == KEY_T) {
                body.classList.toggle("theater-mode");
                if (player.nextElementSibling === head)
                    main.insertBefore(head, player);
                else
                    main.insertBefore(player, head);
            }
        });

        //画中画
        config.mini();
    }
}

config.init();