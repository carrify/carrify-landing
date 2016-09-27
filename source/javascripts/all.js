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
  var cloudURL = "./images/cloud1.svg";
  var maggieURL = "./images/maggie.svg";
  var maggieWidth = 300;
  var maggieHeight = 500;
  var maggieWidthMobile = 200;
  var maggieHeightMobile = 333.33;
  var mobileWidth = 480;

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
    var inc = 300;

    while (x < width) {
      if (generateRandom(1, 4) !== 1) {
        var randX = x + generateRandom(1, 80) * generateRandomSign();
        var randY = y + generateRandom(1, 80) * generateRandomSign();
        var factor = generateRandom(3, 5) / 3.0;
        var cWidth = cloudWidth * factor;
        var cHeight = cloudHeight * factor;

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
    return pageWidth <= mobileWidth ? maggieWidthMobile : maggieWidth;
  }

  function getMaggieHeight() {
    return pageWidth <= mobileWidth ? maggieHeightMobile : maggieHeight;
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

    generateCloudRow(300);
    generateCloudRow(380);
    generateCloudRow(600);

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
