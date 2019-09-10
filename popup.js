function CookieService() {
    this.setCookie = function (key, value) {
        document.cookie = key + "=" + value;
    }

    this.getCookie = function (key) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
}

function HttpService() {
    this.post = function (url, body, callback) {

        let xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(body));

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                callback(xhr.responseText)
            } else {
                throw xhr.responseText;
            }
        }
    }
}

function Popup(elementId) {

    this.show = function () {
        let popup = document.getElementById(elementId);
        let body = document.body;
        popup.style.display = 'block';
        // body.style.overflowY = 'hidden';
    }

    this.hide = function () {
        let popup = document.getElementById(elementId);
        popup.style.display = 'none';
    }

    this.submitEventHandler = function () { }
}

const popup = new Popup('popup');
let popupCounter = 0;

$(document).ready(function () {

    let newCookie = new CookieService();

    newCookie.setCookie('isNew', 'true');
    let isNewCookie = Boolean(newCookie.getCookie('isNew'));

    let phoneNumber = document.getElementById('phone_number');

    $(phoneNumber).mask('999999999');

    let resultMessage1 = document.getElementById('message-1');
    let resultMessage2 = document.getElementById('message-2');

    if (popup.hide()) {
        newCookie.setCookie('isNew', 'false');
        let isNewCookie = Boolean(newCookie.getCookie('isNew'));
        alert(isNewCookie);
    }

    popup.submitEventHandler = function () {

        if (cookie.getCookie('isNew'))
            sendPhoneNumber(phoneNumber.value, function (response) {
                let statuses = Object.keys(response.AntiAbandonEntryStatus);
                statuses.forEach(status => {
                    if (status === 'InProcess' || status === 'Removed') {
                        resultMessage2.style.display = 'block';
                    } else {
                        resultMessage1.style.display = 'block';
                    }
                });
            });
    }

    document.addEventListener('mousemove', function (event) {
        if (event.clientY === 20 || event.clientY < 20) {
            if (isNewCookie === true && popupCounter < 1) {
                setTimeout(() => {
                    popup.show();
                }, 300);
                popupCounter++;
            }
        }
    });
});

function sendPhoneNumber(phoneNumber, callback) {
    let requestBody = {
        AuthInfo: {
            AccessKey: 'c9b64244-2dc8-44db-89a5-c6ae72997bbc',
            ServiceUrl: 'http://dev-by-9/ecs_long/api/CustomerModule/AddPhoneNumberToAntiAbandonTool'
        },
        phoneNumber: phoneNumber
    };

    let http = new HttpService();

    http.post(info.AuthInfo.ServiceUrl, requestBody, callback);
};

function isNumber(event) {
    if (event.keyCode || event.which) {
        let code = event.keyCode || event.which;
        if (code !== 46 && code > 31 && (code < 48 || code > 57)) {
            return false;
        }
        return true;
    }
}

//workaround for bug in jquery version 3
$.fn.andSelf = function () {
    return this.addBack.apply(this, arguments);
};
