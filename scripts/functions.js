"use strict";
/*global
window, APNG
*/
var php_prefix='../php';

function animate() {
  APNG.ifNeeded().then(function () {
    var images = document.querySelectorAll(".apng-image");
    var i;
    for (i = 0; i < images.length; i++) {
      APNG.animateImage(images[i]);
    }
  });
}

function set_length(length, ori) {
  var str = String(ori);
  var i;
  for (i = str.length; i < length; i++) {
    str = '0' + str;
  }
  return str;
}

$(document).ready(function () {
  $('#title').click(function () {
    $('.mdl-layout__drawer').removeClass('is-visible');
  });
  $('.mdl-navigation__link').click(function () {
    $('.mdl-layout__drawer').removeClass('is-visible');
  });
  setTimeout("$('.cover-all').addClass('hidden')", Math.floor(Math.random() * 2000));
});