var submitButton = document.getElementById('submit-button');

// function CookieService() {
//     this.setCookie = function (key, value) {
//         document.cookie = key + "=" + value;
//     };
//
//     this.getCookie = function (key) {
//         var matches = document.cookie.match(new RegExp(
//             "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
//         ));
//         return matches ? decodeURIComponent(matches[1]) : undefined;
//     }
// }

function HttpService() {
    this.post = function (url, body, callback) {
        setTimeout(() => {
            callback({EntryStatus: 1});
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
    now.toUTCString();
    return now;
}

function Popup(elementId) {
    var form = document.getElementById('form');
    var popup = document.getElementById(elementId);

    this.show = function () {
        $(popup).show();
        form.classList.add('animation');
    };

    this.hide = function () {
        $(popup).hide();
    };

    this.submitEventHandler = function (event) {

            submitButton.classList.remove('defaultStyles');
            submitButton.classList.add('additionalStyles');
            submitButton.setAttribute('disabled', '');
            changeColorCount++;
            console.log(submitButton.getAttribute('disabled'));

        sendPhoneNumber(phoneNumber.value, function (response) {
            if (response) {
                submitButton.classList.remove('additionalStyles');
                submitButton.classList.add('defaultStyles');
                submitButton.removeAttribute('disabled');
                console.log(submitButton.getAttribute('disabled'));
            }
            if (response.EntryStatus === 1 || response.EntryStatus === 2 || response.EntryStatus === 4) {
                phoneNumberSaved.style.display = 'block';
            } else if (response.EntryStatus === 3) {
                clientExists.style.display = 'block';
            }
        });
        event.preventDefault();
    };
}

var popup = new Popup('popup');
var userDate = setDate();

var popupCounter = 0;
var changeColorCount = 0;

var widthBody = document.body.clientWidth;
var screenXS = 576 + 'px';

var clientExists = document.getElementById('clientExists');
var phoneNumberSaved = document.getElementById('phoneNumberSaved');
var phoneNumber = document.getElementById('phone_number');

// var cookieDate = new Date();
// cookieDate.setFullYear(cookieDate.getFullYear() + 50);
// var isNewUser = Boolean(cookie.getCookie('isNew'));

$(phoneNumber).mask('999999999');

// popup.submitEventHandler = function (event) {
// if (changeColorCount < 1) {
//     submitButton.classList.remove('defaultStyles');
//     submitButton.classList.add('additionalStyles');
//     changeColorCount++;
// }
// sendPhoneNumber(phoneNumber.value, function (response) {
//     if (response) {
//         submitButton.classList.remove('additionalStyles');
//         submitButton.classList.add('defaultStyles');
//     }
//     if (response.EntryStatus === 1 || response.EntryStatus === 2 || response.EntryStatus === 4) {
//         phoneNumberSaved.style.display = 'block';
//     } else if (response.EntryStatus === 3) {
//         clientExists.style.display = 'block';
//     }
// });
// event.preventDefault();
// };

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

$(document).ready(function () {
    // if (isNewUser === true) {
    enableAntiAbandonPopUp();
    // } else {
    //     hidePopUp();
    // }
});

function enableAntiAbandonPopUp() {
    document.body.addEventListener('mousemove', function (event) {
        if (event.clientY === 20 || event.clientY < 20) {
            if (popupCounter < 1) {
                setTimeout(function () {
                    popup.show();
                }, 200);
                popupCounter++;
            }
        }
    });

    if (widthBody + 'px' <= screenXS) {
        setTimeout(function () {
            popup.show();
        }, 5000);
    }
}

function hidePopUp() {
    var close = document.getElementsByClassName('hide-popup');
    if (close) {
        popup.hide();
    }
}

document.body.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        popup.hide();
    }
});

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
