/***************
 * @Ripple Effect and Smooth Scrolling
 ***************/
var links = doc.querySelectorAll("[href^='#']");
for(var i = 0; i < links.length; i++){
    links[i].addEventListener('click', function (event) {
        event.preventDefault();

        // Remove any old one
        var ripple = doc.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }

        // Setup
        var buttonWidth = this.offsetWidth,
            buttonHeight = this.offsetHeight;

        // Make it round!
        if(buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }

        // Get the center of the element
        var x = event.offsetX==undefined?event.layerX:event.offsetX - buttonWidth / 2,
            y = event.offsetY==undefined?event.layerY:event.offsetY - buttonHeight / 2;

        // Add the element
        var span = doc.createElement('span');
        span.className = 'ripple';
        s = span.style;
        s.width = buttonWidth + 'px';
        s.height = buttonHeight + 'px';
        s.top = y + 'px';
        s.left = x + 'px';
        this.appendChild(span);
    });
}
/***** @End *****/