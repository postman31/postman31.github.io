var iframe = document.getElementsByTagName('iframe')[0],

    iDoc = iframe.contentWindow     // sometimes glamorous naming of variable

        || iframe.contentDocument;  // makes your code working :)

if (iDoc.document) {
    iDoc = iDoc.document;

    iDoc.body.addEventListener('click', function(ev){

                        console.log(ev.target.tagName);
    iDoc.body.addEventListener("mouseover", function( event ) {   
    // highlight the mouseover target
    event.target.style.color = "orange";

    // reset the color after a short delay
    setTimeout(function() {
      event.target.style.color = "";
    }, 500);
  }, false);

                });

};
