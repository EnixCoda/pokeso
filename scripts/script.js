"use strict";
function animate () {
  APNG.ifNeeded().then(function () {
    var images = document.querySelectorAll(".apng-image");
    var i;
    for (i = 0; i < images.length; i++) {
      APNG.animateImage(images[i]);
    }
  });
}

function inArray (item, array) {
  for (var i = 0; i < array.length; i++) {
    if (item == array[i]) {
      return true;
    }
  }
  return false;
}

Array.prototype.contain = function(item) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == item) {
      return true;
    }
  }
  return false;
}