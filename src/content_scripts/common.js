//检查DOM时间间隔(秒)
let sec = 500;
let KEY_C = 67;
let KEY_F = 70;
let KEY_I = 73;
let KEY_T = 84;

let PROPERTIES_KEY = "PROPERTIES_KEY";
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