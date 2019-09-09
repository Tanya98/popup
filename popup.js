setInterval(() => {
    document.addEventListener('mousemove', function (e) {
        if (e.clientY === 70 || e.clientY < 70) {
            show();
        }
        // console.log(e.clientY);
    });
}, 1000);


function show() {
    var popup = document.getElementById('popup');
    popup.style.display = 'block';
}

function hide() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
    console.log('hello');
}

function isNumber(e) {
    var iKeyCode = e.keyCode;
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

        return true;
    
}