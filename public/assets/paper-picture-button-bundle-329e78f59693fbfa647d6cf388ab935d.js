// Create a picture button that loads in a Paper Canvas
// Assumes paper.setup has already been called on a canvas
function PaperPictureButton (size, pos, bound, normalURL, 
                             highlightURL, pressedURL) 
  {
    var obj = this;
    obj.size = size;
    obj.normalURL = normalURL;
    obj.highlightURL = highlightURL;
    obj.pressedURL = pressedURL;
    obj.imgRaster = new paper.Raster (obj.normalURL, pos);
    obj.imgRaster.onLoad = function () {
      obj.imgRaster.size = obj.size;
    };
    obj.bound = bound;
    obj.boundGroup = new paper.Group ([obj.bound, obj.imgRaster]);
    obj.boundGroup.clipped = true;

    // Bind image changes to highlight and press
    obj.imgRaster.on ('mouseleave', function (event) {
      obj.imgRaster.source = obj.normalURL;
      obj.imgRaster.size = obj.size;
    });

    obj.imgRaster.on ('mouseenter', function (event) {
      obj.imgRaster.source = obj.highlightURL;
      obj.imgRaster.size = obj.size;
    });

    obj.imgRaster.on ('mousedown', function (event) {
      obj.imgRaster.source = obj.pressedURL;
      obj.imgRaster.size = obj.size;
    });

    obj.imgRaster.on ('mouseup', function (event) {
      obj.imgRaster.source = obj.highlightURL;
      obj.imgRaster.size = obj.size;
    });

    // Bind a handle to the image raster click
    obj.bindClick = function (clickHandle) {
      obj.imgRaster.on ('click', function (event) {
        clickHandle ();
      });
    };    
  };
