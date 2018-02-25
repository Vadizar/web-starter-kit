var
    slide = doc.getElementById('nav-icon'),
    menu = doc.getElementsByTagName('aside')[0],
    nav = doc.getElementsByTagName('nav')[0];

// Menu Open/Close
function menuToggle() {
    slide.classList.toggle('active');
    menu.classList.toggle('active');
    if (menu.classList.contains('active')) {
        menu.classList.add('visible');
    }
    else {
        setTimeout(function () {
            menu.classList.remove('visible');
        }, 300);
    }
}
slide.addEventListener('click', menuToggle);

// Menu Close
function menuClose() {
    slide.classList.remove('active');
    menu.classList.remove('active');
    setTimeout(function () {
        menu.classList.remove('visible');
    }, 300);
}

// Menu Close Click Outside
function menuCloseClickOutside(e) {
    if(!e.target.matches('#nav-icon, #nav-icon *, aside, aside *')) {
        menuClose();
    }
}
doc.addEventListener('click', menuCloseClickOutside);
doc.addEventListener('touchstart', menuCloseClickOutside);

// Menu Close Press ESC
function menuCloseESC() {
    if (event.which === 27) {
        menuClose();
    }
}
doc.addEventListener('keyup', menuCloseESC);