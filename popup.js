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

function getDate() {
    let now = new Date();
    let month = now.getMonth();
    let year = now.getFullYear();
    let num = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let date = month + '/' + num + '/' + year;
    let time = hours + ':' + minutes;
    let userDate = date + ' ' + time;
    return userDate;
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
let newUser = new CookieService();
let userDate = getDate();

let popupCounter = 0;
let userRegistered = false;

let widthBody = document.body.style.width;
let clientExists = document.getElementById('clientExists');
let phoneNumberSaved = document.getElementById('phoneNumberSaved');
let phoneNumber = document.getElementById('phone_number');
let screenXS = 576 + 'px';

$(document).ready(function () {

    newUser.setCookie('isNew', 'true');

    let isNewUser = Boolean(newUser.getCookie('isNew'));

    $(phoneNumber).mask('999999999');

    popup.submitEventHandler = function () {
        sendPhoneNumber(phoneNumber.value, function (response) {
            if (response.EntryStatus === 1 || response.EntryStatus === 2 || response.EntryStatus === 4) {
                phoneNumberSaved.style.display = 'block';
            } else if (response.EntryStatus === 3) {
                clientExists.style.display = 'block';
            }
        });
    };

    if (isNewUser === true) {
        // debugger;
        showPopUp();
    } else if (isNewUser === false) {
        hidePopUp();
    }

    // hidePopUp();

    document.onkeydown = function (event) {
        if (event.key === 'Escape') {
            newUser.setCookie('isNew', 'false');
            popup.hide();
        }
    };
});

function showPopUp() {
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

    if (widthBody <= screenXS) {
        userRegistered = true;
        setTimeout(() => {
            popup.show();
        }, 5000);
    }
}

function hidePopUp() {
    newUser.setCookie('isNew', 'false');
    $('.hide-popup').click(popup.hide());
}

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
