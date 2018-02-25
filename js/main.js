var
    doc = document,
    win = window,
    body = doc.body;

/***************
 * @Main addEventListener DOMContentLoaded
 ***************/
function DOMContentLoaded() {

    // Mobile Safari in standalone mode
    if(win.navigator.standalone) {

        // Prevent links in standalone web apps opening Mobile Safari
        var a=doc.getElementsByTagName("a");
        for(var i=0;i<a.length;i++) {
            a[i].onclick=function() {
                win.location=this.getAttribute("href");
                return false
            }
        }
    }
}

doc.onreadystatechange = function () {
    if (doc.readyState == "complete") {
        DOMContentLoaded();
    }
};
/***** @End *****/