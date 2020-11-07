//检查DOM时间间隔(秒)
let sec = 500;
let KEY_C = "c";
let KEY_F = "f";
let KEY_I = "i";
let KEY_T = "t";
let KEY_M = "m";

let PROPERTIES_KEY = "PROPERTIES_KEY";
let PROGRESS_KEY = "PROGRESS_KEY";

let DOMAIN_ACFUN = "DOMAIN_ACFUN";
let DOMAIN_BILIBILI = "DOMAIN_BILIBILI";

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

function toggleFullScreen(elem) {
    if (!document.fullscreenElement) {
        elem.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}