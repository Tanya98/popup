let count = 0;
let xhr = new XMLHttpRequest();

document.addEventListener('mousemove', function (event) {
    let timerId = setTimeout(() => {
        if (event.clientY === 20 || event.clientY < 20) {
            show();
        }
    }, 400);
});


function show() {
    let popup = document.getElementById('popup');
    // let form = document.getElementById('form');
    popup.style.display = 'block';
}

function hide() {
    let popup = document.getElementById('popup');
    popup.style.display = 'none';
}

function isNumber(event) {
    let keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    keys.forEach(key => {
        if (event.key !== key) {
            return false;
        }
        return true;
    });

    if (event.keyCode !== undefined && event.which) {
        let code = event.keyCode || event.which;
        if (code !== 46 && code > 31 && (code < 48 || code > 57)) {
            return false;
        }
        return true;
    }
}

// $('#register_mobile,#register_phone').mask("999999999", {placeholder: "_________"});

