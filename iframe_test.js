document.addEventListener("DOMContentLoaded", function() {
  var frames = document.querySelectorAll('iframe');
  frames.forEach(function(frame) {
    //frame.src = "/thankyou.html";
    console.log(frame.src);
  });
  console.log('DOMContentLoaded executed');
});
