var submitButton = document.getElementById('submit-button');

var clientExistsMessage = document.getElementById('clientExists');
var phoneNumberSavedMessage = document.getElementById('phoneNumberSaved');
var phoneNumber = document.getElementById('phone_number');

$(phoneNumber).mask('999999999');

function localStorageService() {

    this.setUserItem = function (userStatus, userDate) {
        let userParams = {
            isNew: userStatus,
            dateTime: userDate
        }

        let antiAbandonPopUp = JSON.stringify(userParams);
        localStorage.setItem('antiAbandonPopUp', antiAbandonPopUp);
    }
    this.getUserItem = function (str) {
        let result = JSON.parse(localStorage.getItem(str));
        return result;
    }

    this.removeUserItem = function (str) {
        localStorage.removeItem(str);
    }
}

function HttpService() {
    this.post = function (url, body, callback) {
        setTimeout(() => {
            callback({ EntryStatus: 1 });
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

function Popup() {
    var form = document.getElementById('form');
    var popup = document.getElementById('popup');

    this.show = function () {
        $(popup).show();
        form.classList.add('animation');
    };

    this.hide = function () {
        localStorageService.setUserItem(false, date);
        $(popup).hide();
    };

    this.submitEventHandler = function (event) {

        submitButton.classList.remove('defaultStyles');
        submitButton.classList.add('additionalStyles');
        submitButton.setAttribute('disabled', '');

        sendPhoneNumber(phoneNumber.value, function (response) {
            if (response) {
                submitButton.classList.remove('additionalStyles');
                submitButton.classList.add('defaultStyles');
                submitButton.removeAttribute('disabled');
            }
            if (response.EntryStatus === 1 || response.EntryStatus === 2 || response.EntryStatus === 4) {
                phoneNumberSavedMessage.style.display = 'block';
            } else if (response.EntryStatus === 3) {
                clientExistsMessage.style.display = 'block';
            }
        });
        event.preventDefault();
    };
}

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

var popupCounter = 0;
var date = new Date().getTime();
var popup = new Popup();
var localStorageService = new localStorageService();

var userLogged = false;
var popUpOpened = true;

var widthBody = document.body.clientWidth;
var screenXS = 576 + 'px';

let antiAbandonPopUp = localStorageService.getUserItem('antiAbandonPopUp');

$(document).ready(function () {
    if (userLogged === false && antiAbandonPopUp === null || antiAbandonPopUp.isNew === true) {
        localStorageService.setUserItem(true, date);
        enableAntiAbandonPopUp();

    } else if (userLogged === true && antiAbandonPopUp === null) {
        localStorageService.setUserItem(false, date);
    }
});

function enableAntiAbandonPopUp() {
    document.body.addEventListener('mousemove', function (event) {
        if (event.clientY <= 20) {
            if (popupCounter < 1) {
                popUpOpened = true;
                setTimeout(function () {
                    popup.show();
                    console.log(popUpOpened);
                }, 150);
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

function disableAntiAbandonPopUp() {
    var close = document.getElementsByClassName('hide-popup');
    if (close) {
        popup.hide();
        popUpOpened = false;
    }
}
if (!popUpOpened) {
    document.body.addEventListener('keydown', function (event) {
        alert('works');
        if (event.key === 'Escape') {
            popup.hide();
            popUpOpened = false;
        }
    });
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
