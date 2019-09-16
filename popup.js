var submitButton = document.getElementById('submit-button');
function CookieService() {
    this.setCookie = function (key, value) {
        document.cookie = key + "=" + value;
    };

    this.getCookie = function (key) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
}

function HttpService() {
    this.post = function (url, body, callback) {
        setTimeout(() => {
            callback({ EntryStatus: 1 });
            submitButton.style.background = 'linear-gradient(0deg, #a9d156 0%, #abd35b 83%, #bcdd7a 100%)';
            submitButton.style.color = '#174c2e';
        }, 2000);

        var xhr = new XMLHttpRequest();
        var response;

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
        };
    }
}

function setDate() {
    var now = new Date();
    var month = now.getMonth();
    var year = now.getFullYear();
    var num = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var date = month + '/' + num + '/' + year;
    var time = hours + ':' + minutes;
    var userDate = date + ' ' + time;
    return userDate;
}

function Popup(elementId) {

    this.show = function () {
        var popup = document.getElementById(elementId);
        var form = document.getElementById('form');
        $(popup).show();
        form.classList.add('animation');
    };

    this.hide = function () {
        var popup = document.getElementById(elementId);
        $(popup).hide();

    };

    this.submitEventHandler = function () {
    };
}

var popup = new Popup('popup');
var newUser = new CookieService();
var userDate = setDate();

var popupCounter = 0;
var userRegistered = false;

var widthBody = document.body.clientWidth;
var clientExists = document.getElementById('clientExists');
var phoneNumberSaved = document.getElementById('phoneNumberSaved');
var phoneNumber = document.getElementById('phone_number');
var screenXS = 576 + 'px';

newUser.setCookie('isNew', 'true');
newUser.setCookie('DateTime', userDate);

var isNewUser = Boolean(newUser.getCookie('isNew'));

$(phoneNumber).mask('999999999');

popup.submitEventHandler = function (event) {
    submitButton.style.background = '#d0cbcb';
    submitButton.style.color = '#000';
    sendPhoneNumber(phoneNumber.value, function (response) {
        if (response.EntryStatus === 1 || response.EntryStatus === 2 || response.EntryStatus === 4) {
            phoneNumberSaved.style.display = 'block';
        } else if (response.EntryStatus === 3) {
            clientExists.style.display = 'block';
        }
    });
    event.preventDefault();
};

$(document).ready(function () {

    if (userRegistered === true) {
        hidePopUp();
    } else {
        showPopUp();
    }
});

function showPopUp() {
    document.onmousemove = function (event) {
        if (event.clientY === 20 || event.clientY < 20) {
            if (popupCounter < 1) {
                setTimeout(function () {
                    popup.show();
                }, 200);
                popupCounter++;
            }
        }
    };

    if (widthBody + 'px' <= screenXS) {
        setTimeout(function () {
            popup.show();
        }, 5000);
    }
}

function hidePopUp() {
    var close = document.getElementsByClassName('hide-popup');
    newUser.setCookie('isNew', 'false');
    if (close) {
        popup.hide();
    }
}

document.body.addEventListener('keydown', function (event) {
    console.log(event.key);
});

document.body.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        newUser.setCookie('isNew', 'false');
        popup.hide();
    }
});

function sendPhoneNumber(phoneNumber, callback) {
    var requestBody = {
        AuthInfo: {
            AccessKey: 'c9b64244-2dc8-44db-89a5-c6ae72997bbc',
            ServiceUrl: ''
        },
        phoneNumber: phoneNumber
    };

    var http = new HttpService();
    http.post('http://dev-by-9/ecs_long/api/CustomerModule/AddPhoneNumberToAntiAbandonTool', requestBody, callback);
}

function isNumber(event) {
    if (event.keyCode || event.which) {
        var code = event.keyCode || event.which;
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
