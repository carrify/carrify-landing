(function() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var pageWidth = document.body.clientWidth;
  var pageHeight = document.body.clientHeight;

  canvas.setAttribute("width", pageWidth);
  canvas.setAttribute("height", pageHeight);

  var clouds = [];
  var cloudWidth = 200;
  var cloudHeight = 95;
  var cloudWidthMobile = 100;
  var cloudHeightMobile = 47;
  var cloudURL = "./images/cloud1.svg";
  var maggieURL = "./images/maggie.svg";
  var maggieWidth = 300;
  var maggieHeight = 500;
  var maggieWidthMobile = 200;
  var maggieHeightMobile = 333.33;
  var maggieWidthSmall = 250;
  var maggieHeightSmall = 417;
  var mobileWidth = 417;
  var mobileHeight = 800;

  var imgCloud;
  var imgMaggie;

  (function init() {
    imgCloud = new Image();

    imgCloud.onload = function() {
      start();
    };

    imgCloud.src = cloudURL;

    // Maggie
    imgMaggie = new Image();
    imgMaggie.src = maggieURL;
  })();

  function printCloud(x, y, width, height) {
    context.drawImage(imgCloud, x, y, width, height);
  }

  function printMaggie(x, y, width, height) {
    context.drawImage(imgMaggie, x, y, width, height);
  }

  function generateCloudRow(y) {
    var x = 0;
    var width = pageWidth * 1.5;
    var inc = pageWidth / 4;

    while (x < width) {
      if (generateRandom(1, 4) !== 1) {
        var randX = x + generateRandom(1, 80) * generateRandomSign();
        var randY = y + generateRandom(1, 80) * generateRandomSign();
        var factor = generateRandom(3, 5) / 3.0;
        var cWidth = getCloudWidth() * factor;
        var cHeight = getCloudHeight() * factor;

        clouds.push({
          'x': randX,
          'y': randY,
          'width': cWidth,
          'height': cHeight
        });

        printCloud(randX, randY, cWidth, cHeight);
      }

      x += inc;
    }
  }

  function generateRandomSign() {
    return generateRandom(0, 1) === 0 ? -1 : 1;
  }

  function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function getMaggieWidth() {
    if (pageWidth <= mobileWidth) {
      return maggieWidthMobile;
    }

    if (pageHeight < mobileHeight) {
      return maggieWidthSmall;
    }

    return maggieWidth;
  }

  function getMaggieHeight() {
    if (pageWidth <= mobileWidth) {
      return maggieHeightMobile;
    }

    if (pageHeight < mobileHeight) {
      return maggieHeightSmall;
    }

    return maggieHeight;
  }

  function getCloudWidth() {
    return pageWidth <= mobileWidth ? cloudWidthMobile : cloudWidth;
  }

  function getCloudHeight() {
    return pageWidth <= mobileWidth ? cloudHeightMobile : cloudHeight;
  }

  var timeInterval = 150;
  var interval;
  var maggieFlying = false;
  var maggiePosX = pageWidth / 2 - getMaggieWidth() / 2;
  var maggiePosY1 = pageHeight / 3 - 10;
  var maggiePosY2 = maggiePosY1 + 20;
  var maggiePosY = pageHeight;
  var maggiePosYEnd = maggiePosY1;
  var maggiePosYDir = 1;
  var firstEnd = false;

  function start() {
    clouds = [];

    var initialY = pageHeight / 2;

    generateCloudRow(initialY);
    generateCloudRow(initialY + getCloudHeight());
    generateCloudRow(initialY + getMaggieHeight() * 2);

    var cloudLength = clouds.length;

    clearInterval(interval);

    interval = setInterval(function() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < cloudLength; i++) {
        var cloud = clouds[i];

        clouds[i].x = cloud.x - 1;

        if (clouds[i].x + clouds[i].width < 0) {
          clouds[i].x = pageWidth * 1.5;
        }

        printCloud(cloud.x, cloud.y, cloud.width, cloud.height);
      }

      if (maggieFlying) {
        printMaggie(maggiePosX, maggiePosY, getMaggieWidth(), getMaggieHeight());

        if (!firstEnd) {
          maggiePosY -= 30;

          if (maggiePosY < maggiePosYEnd) {
            firstEnd = true;
          }
        } else {
          if (maggiePosYDir === 1) {
            maggiePosY++;

            if (maggiePosY > maggiePosY2) {
              maggiePosYDir = -1;
            }
          } else {
            maggiePosY--;

            if (maggiePosY < maggiePosY1) {
              maggiePosYDir = 1;
            }
          }
        }
      }
    }, timeInterval);
  }

  window.onresize = function(event) {
    start();
  };

  setTimeout(function() {
    document.getElementById("subtitle").style.display = "block";
    maggieFlying = true;
  }, 6000);
})();
