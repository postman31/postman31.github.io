// Helper function to fetch URL parameters by key

var getJsonFromUrl = function(key) {
  var query = mlocation.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result[key]||null;
}
var aw_keys = ['gclid', 'aw_campaign', 'aw_content', 'aw_term'];
if(getJsonFromUrl('gclid')) {
  sessionStorage.['gclid'] = getJsonFromUrl('gclid');
  aw_keys.map(function(key) {
    var value = getJsonFromUrl(key);
    if (value) {
      sessionStorage[key] = value;
    }
  })
};


document.addEventListener("DOMContentLoaded", function() {
  var frames = document.querySelectorAll('iframe');
  var re = /https*:\/\/embeds\.audioboom\.com.+/
  var params = '';
  if (sessionStorage['gclid']) {
    params += '&utm_source=tenk' +
    '&utm_campaign=' + sessionStorage['aw_campaign'] +
    '&utm_term=' + sessionStorage['aw_term'] +
    '&utm_content=' + sessionStorage['aw_content'];
  }
  frames.forEach(function(frame) {
    //frame.src = "/thankyou.html";
    if (re.test(frame.src) && sessionStorage['gclid']) {
      frame.src += params;
    }
    console.log(frame.src);
  });
  console.log('DOMContentLoaded executed');
});
