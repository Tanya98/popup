var submitButton = document.getElementById('submit-button');

var clientExistsMessage = document.getElementById('clientExists');
var phoneNumberSavedMessage = document.getElementById('phoneNumberSaved');
var phoneNumber = document.getElementById('phone_number');

$(phoneNumber).mask('000000000');

function LocalStorageService() {

    this.setUserItem = function (userStatus, userDate) {
        let userParams = {
            isNew: userStatus,
            dateTime: userDate
        };

        let antiAbandonPopUp = JSON.stringify(userParams);
        localStorage.setItem('antiAbandonPopUp', antiAbandonPopUp);
    };

    this.getUserItem = function (str) {
        let result = JSON.parse(localStorage.getItem(str));
        return result;
    };
}

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

function Popup() {
    var form = document.getElementById('form');
    var popup = document.getElementById('popup');
    var body = document.body;

    this.show = function () {
        $(popup).show();
        form.classList.add('animation');
        body.style.overflowY = 'hidden';
    };

    this.hide = function () {
        lstorageService.setUserItem(false, date);
        $(popup).hide();
        body.style.overflowY = 'scroll';
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
var date = new Date();
var popup = new Popup();
var lstorageService = new LocalStorageService();

var userLogged = false;
var popUpIsOpened = false;

var widthBody = document.body.clientWidth;
var screenXS = 576;

let antiAbandonPopUp = lstorageService.getUserItem('antiAbandonPopUp');

$(document).ready(function () {
    if (userLogged === false && antiAbandonPopUp === null) {
        lstorageService.setUserItem(true, date);
        activateAntiAbandonPopUp();

    } else if (userLogged === false && antiAbandonPopUp.isNew === true) {
        activateAntiAbandonPopUp();

    } else if ((userLogged === true && antiAbandonPopUp === null) || (userLogged === true && antiAbandonPopUp.isNew === true)) {
        lstorageService.setUserItem(false, date);
    }
});

function activateAntiAbandonPopUp() {
    document.body.addEventListener('mouseleave', function (event) {
        if (event.clientY < 100) {
            popUpIsOpened = true;
            if (popupCounter < 1) {
                popup.show();
            }
            popupCounter++;
        }
    });

    if (widthBody <= screenXS) {
        if (popupCounter < 1) {
            setTimeout(function () {
                popUpIsOpened = true;
                popup.show();
            }, 1000);
        }
        popupCounter++;
    }

    document.body.addEventListener('keydown', function (event) {
        if (popUpIsOpened === true) {
            if (event.key === 'Escape') {
                popup.hide();
                popUpIsOpened = false;
            }
        }
    });
}


function deactivateAntiAbandonPopUp() {
    var close = document.getElementsByClassName('hide-popup');
    if (close) {
        popup.hide();
        popUpIsOpened = false;
    }
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
