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