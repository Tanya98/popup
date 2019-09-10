let xhr = new XMLHttpRequest();
let popupCounter = 0;
// document.addEventListener('load ', function () {
//     console.log(setCookie('isNew', 'true'));
// });


document.addEventListener('mousemove', function (event) {
    // if (Boolean(cookieValue) === true) {
    if (event.clientY === 20 || event.clientY < 20) {
        if (popupCounter < 1) {
            setTimeout(() => {
                show();
            }, 300);
            popupCounter++;
        }
    }
});

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value) {
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    document.cookie = updatedCookie;
}

function show() {
    let popup = document.getElementById('popup');
    let form = document.getElementById('form');
    form.style.animationDuration = 5 + 's';
    form.style.animationDelay = 3 + 's';
    let body = document.body;
    popup.style.display = 'block';
    body.style.overflowY = 'hidden';
}

function hide() {
    let popup = document.getElementById('popup');
    popup.style.display = 'none';
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


function submitPhoneNumber() {
    let inputValue = document.getElementById('phone_number').value;
    let resultMessage1 = document.getElementById('message-1');
    let resultMessage2 = document.getElementById('message-2');
    let info = {
        AuthInfo: {
            AccessKey: 'c9b64244-2dc8-44db-89a5-c6ae72997bbc',
            ServiceUrl: 'http://dev-by-9/ecs_long/api/CustomerModule/AddPhoneNumberToAntiAbandonTool'
        },
        phoneNumber: inputValue
    };

    let body = JSON.stringify(info);

    xhr.open('POST', 'http://dev-by-9/ecs_long/api/CustomerModule/AddPhoneNumberToAntiAbandonTool', true);
    xhr.send(body);
    let response = xhr.responseText;

    if (xhr.status !== 200) {
        xhr.onerror = function (error) {
            console.log(xhr.status + ': ' + xhr.statusText + error);
        }
    } else if (response) {
        let statuses = Object.keys(response.AntiAbandonEntryStatus);
        statuses.forEach(status => {
            if (status === 'InProcess' || status === 'Removed') {
                resultMessage2.style.display = 'block';
            } else {
                resultMessage1.style.display = 'block';
            }
        });
    }
}


$.fn.andSelf = function () {
    return this.addBack.apply(this, arguments);
};

$(document).ready(function () {
    // console.log(getCookie('isNew'));
    $('#phone_number').mask('999999999');
});


