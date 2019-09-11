function CookieService() {
    this.setCookie = function (key, value) {
        document.cookie = key + "=" + value;
    };

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
        let response;

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(body));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                response = JSON.parse(xhr.responseText);
                callback(response);
            } else {
                throw xhr.responseText;
            }
        }
    }
}

function Popup(elementId) {

    this.show = function () {
        let popup = document.getElementById(elementId);
        // let body = document.body;
        $(popup).show();
        // popup.style.display = 'block';
        // body.style.overflowY = 'hidden';
    };

    this.hide = function () {
        let popup = document.getElementById(elementId);
        $(popup).hide();
        // popup.style.display = 'none';
    };

    this.submitEventHandler = function () {
    };
}

const popup = new Popup('popup');
let newCookie = new CookieService();

let popupCounter = 0;

let userRegistered = false;

let widthBody = document.body.style.width;
let clientExists = document.getElementById('clientExists');
let phoneNumberSaved = document.getElementById('phoneNumberSaved');
let phoneNumber = document.getElementById('phone_number');


$(document).ready(function () {

    newCookie.setCookie('isNew', 'true');

    let isNewUser = Boolean(newCookie.getCookie('isNew'));

    $(phoneNumber).mask('999999999');

    popup.submitEventHandler = function () {
        // if (cookie.getCookie('isNew'))
        sendPhoneNumber(phoneNumber.value, function (response) {
            if (response.EntryStatus === 1 || response.EntryStatus === 2 || response.EntryStatus === 4) {
                phoneNumberSaved.style.display = 'block';
            }
            if (response.EntryStatus === 3) {
                clientExists.style.display = 'block';
            }
        });
    };

    document.onmousemove = function (event) {
        if (event.clientY === 20 || event.clientY < 20) {
            userRegistered = true;
            if (popupCounter < 1) {
                setTimeout(() => {
                    popup.show();
                }, 200);
                popupCounter++;
            }
        }
    };

    if (widthBody <= 414 + 'px') {
        userRegistered = true;
        setTimeout(() => {
            popup.show();
        }, 5000);
    }

    document.onkeydown = function (event) {
        if (event.key === 'Escape') {
            popup.hide();
        }
    };
});

// function showPopUp() {
//     // debugger;
//
// }

// function showPopUpForMobile() {
//     // debugger;
//
// }

function sendPhoneNumber(phoneNumber, callback) {
    let requestBody = {
        AuthInfo: {
            AccessKey: 'c9b64244-2dc8-44db-89a5-c6ae72997bbc',
            ServiceUrl: ''
        },
        phoneNumber: phoneNumber
    };

    let http = new HttpService();

    http.post('http://dev-by-9/ecs_long/api/CustomerModule/AddPhoneNumberToAntiAbandonTool', requestBody, callback);
}

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
