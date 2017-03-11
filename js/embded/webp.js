// Support webp

var
   html = document.documentElement,
   WebP = new Image();
WebP.onload = WebP.onerror = function () {
   if (WebP.height === 2) {
      html.className += 'webp';
   }
};
WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';