let PROPERTIES_KEY = "PROPERTIES_KEY";
let PROGRESS_KEY = "PROGRESS_KEY";

let DOMAIN_ACFUN = "DOMAIN_ACFUN";
let DOMAIN_BILIBILI = "DOMAIN_BILIBILI";

let CHECKBOX_KEY_CHECK = "data-check";
let CHECKBOX_KEY_DOMAIN = "data-domain";
let CHECKBOX_KEY_PROGRESS = "data-progress";

let checkboxAcfun = document.querySelector(".checkbox[" + CHECKBOX_KEY_DOMAIN + "='" + DOMAIN_ACFUN + "']");
let checkboxBiliBili = document.querySelector(".checkbox[" + CHECKBOX_KEY_DOMAIN + "='" + DOMAIN_BILIBILI + "']");

let progressCheckboxAcfun = document.querySelector(".checkbox[" + CHECKBOX_KEY_PROGRESS + "='" + DOMAIN_ACFUN + "']");

chrome.storage.sync.get(null, function (properties) {
    if (properties[PROPERTIES_KEY]) {
        checkboxAcfun.setAttribute(CHECKBOX_KEY_CHECK, properties[PROPERTIES_KEY][DOMAIN_ACFUN]);
        checkboxBiliBili.setAttribute(CHECKBOX_KEY_CHECK, properties[PROPERTIES_KEY][DOMAIN_BILIBILI]);
        progressCheckboxAcfun.setAttribute(CHECKBOX_KEY_CHECK, properties[PROGRESS_KEY][DOMAIN_ACFUN]);
    }
});

let checkboxClick = function (e) {
    let target = e.target;
    target.setAttribute(CHECKBOX_KEY_CHECK, target.getAttribute(CHECKBOX_KEY_CHECK) == "true" ? "false" : "true");

    chrome.storage.sync.set({
        PROPERTIES_KEY: {
            DOMAIN_ACFUN: checkboxAcfun.getAttribute(CHECKBOX_KEY_CHECK),
            DOMAIN_BILIBILI: checkboxBiliBili.getAttribute(CHECKBOX_KEY_CHECK),
        },
        PROGRESS_KEY: {
            DOMAIN_ACFUN: progressCheckboxAcfun.getAttribute(CHECKBOX_KEY_CHECK),
        }
    }, function () { });
};
checkboxAcfun.addEventListener("click", checkboxClick);
checkboxBiliBili.addEventListener("click", checkboxClick);
progressCheckboxAcfun.addEventListener("click", checkboxClick);