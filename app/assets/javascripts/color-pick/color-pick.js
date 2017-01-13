function ColorPicker (cid, svid, hid, openerid, formid)
  {
    this.cid = cid;
    this.svid = svid;
    this.hid = hid;
    this.openerid = openerid;
    this.formid = formid;

    this.svc = document.getElementById (svid);
    this.svctx = this.svc.getContext ("2d");
    this.svnumPixels = this.svc.width * this.svc.height;
    this.hc = document.getElementById (hid);
    this.hctx = this.hc.getContext ("2d");
    this.hnumPixels = this.hc.width * this.hc.height;

    this.selectedHue = 0;
    this.selectedS = 0;
    this.selectedV = 0;
    this.hueColor = Array (255, 0, 0);
    this.selectedColor = Array (0, 0, 0);

    $("#" + this.cid).on ("mousedown mousemove", function (evt)
      {
        evt.preventDefault ();
      });

    var obj = this;
    this.mouseDownH = function (evt)
      {
        $("#" + hid).bind ("mousemove", obj.mouseMoveH);
	      obj.pickHue (evt);
      };

    this.mouseMoveH = function (evt)
      {
	      $('body').css ('cursor', 'default');
        obj.pickHue (evt);
      };

    this.unbindH = function (evt)
      {
        $("#" + hid).unbind ("mousemove", obj.mouseMoveH);
      };

    this.mouseDownSV = function (evt)
      {
        $("#" + svid).bind ("mousemove", obj.mouseMoveSV);
	      obj.pickSV (evt);
      };

    this.mouseMoveSV = function (evt)
      {
        $('body').css ('cursor', 'default');
	      obj.pickSV (evt);
      };

    this.unbindSV = function (evt)
      {
        $("#" + svid).unbind ("mousemove", obj.mouseMoveSV);
      };

    $("#" + hid).bind ("mousedown", obj.mouseDownH);
    $("#" + hid).bind ("mouseup", obj.unbindH);
    $("#" + hid).bind ("mouseout", obj.unbindH);
    $("#" + svid).bind ("mousedown", obj.mouseDownSV);
    $("#" + svid).bind ("mouseup", obj.unbindSV);
    $("#" + svid).bind ("mouseout", obj.unbindSV);

    this.drawSV = function (hue)
      {
        var i = 0;
        var curPixel = 0;
        var svimageData = new ImageData (this.svc.width, this.svc.height);
        var svdata = svimageData.data;
        for (curPixel = 0; curPixel < this.svnumPixels; curPixel++)
          {
            var val = (curPixel % this.svc.width) / this.svc.width * 100;
            var sat = (this.svc.height - Math.floor (curPixel / this.svc.width)) / this.svc.height * 100;
            var curColor = Array(hue [0], hue [1], hue [2]);
            curColor.forEach (function (elem, idx, arr) 
             {
                curColor [idx] = (curColor [idx] + ((100 - sat) / 100 * (255 - curColor [idx]))) * val / 100;
             });
            svdata [i] = curColor [0];
            svdata [i + 1] = curColor [1];
            svdata [i + 2] = curColor [2];
            svdata [i + 3] = 255;
            i += 4;
          };
        this.svctx.putImageData (svimageData, 0, 0);
      };

    this.drawH = function ()
      {
        var curPixel, i, j;
        var curHue = 0;
        var curColor = Array (0, 0, 0);
        var himageData = new ImageData (this.hc.width, this.hc.height);
        var hdata = himageData.data;
        var hstep = 360 / this.hc.height;
        for (i = this.hc.height; i > 0; i--)
          {
            hueToColor (curHue, curColor);
            curPixel = (i - 1) * this.hc.width * 4;
            for (j = 0; j < this.hc.width; j++)
              {
                hdata [curPixel] = curColor [0];
                hdata [curPixel + 1] = curColor [1];
                hdata [curPixel + 2] = curColor [2];
                hdata [curPixel + 3] = 255;
                curPixel += 4;
              };
            curHue = Math.round (curHue + hstep);
          };
        this.hctx.putImageData (himageData, 0, 0);
      };

      this.drawHueLines = function (y)
        {
	        this.hctx.fillStyle = "#FFFFFF";
	        this.hctx.fillRect (0, y-3, this.hc.width, 3);
          this.hctx.fillStyle = "#000000";
	        this.hctx.fillRect (0, y-2, this.hc.width, 1);
        };

      this.pickHue = function (evt)
        {
          this.drawH ();
          var hue = Math.round (359 / this.hc.height * (this.hc.height - evt.offsetY));
	        hueToColor (hue, this.hueColor);
          this.drawHueLines (evt.offsetY);
          this.drawSV (this.hueColor);
        };

      this.pickSV = function (evt)
        {
          this.drawSV (this.hueColor);
	        this.drawSVLines (evt.offsetX, evt.offsetY);
          var val = evt.offsetX / this.svc.width * 100;
          var sat = (this.svc.height - evt.offsetY) / this.svc.height * 100;
	        var hue = this.hueColor;
	        var curColor = this.selectedColor;
          curColor.forEach (function (elem, idx, arr) 
            {
              curColor [idx] = Math.floor ((hue [idx] + ((100 - sat) / 100 * (255 - hue [idx]))) * val / 100);
            });
	        curColor = "#" + toHex (this.selectedColor [0]) + 
                      toHex (this.selectedColor [1]) +
                      toHex (this.selectedColor [2]);
          var openerc = document.getElementById (this.openerid);
          var openerctx = openerc.getContext ("2d");
	        openerctx.fillStyle = curColor;
	        openerctx.fillRect (0, 0, openerc.width, openerc.height);
          $("#" + formid).val (curColor);
        };

      this.drawSVLines = function (x, y)
        {
          this.svctx.fillStyle = "#FFFFFF";
	        this.svctx.fillRect (x-1, 0, 3, this.svc.height);
	        this.svctx.fillRect (0, y-1, this.svc.width, 3);
	        this.svctx.fillStyle = "#000000";
	        this.svctx.fillRect (x, 0, 1, this.svc.height);
	        this.svctx.fillRect (0, y, this.svc.width, 1);
	      };

      this.drawH ();
      this.drawSV (Array (255, 0, 0));
    };

function hueToColor (hue, curColor)
  {
    var increasing = Math.floor ((hue % 60) / 59 * 255);
    var decreasing = Math.floor ((59 - (hue % 60)) / 59 * 255);
    if (hue < 60)
      {
        curColor [0] = 255;
        curColor [1] = increasing;
        curColor [2] = 0;
      }
    else if (hue < 120)
      {
        curColor [0] = decreasing;
        curColor [1] = 255;
        curColor [2] = 0;
      }
    else if (hue < 180)
      {
        curColor [0] = 0;
        curColor [1] = 255;
        curColor [2] = increasing;
      }
    else if (hue < 240)
      {
        curColor [0] = 0;
        curColor [1] = decreasing;
        curColor [2] = 255;
      }
    else if (hue < 300)
      {
        curColor [0] = increasing;
        curColor [1] = 0;
        curColor [2] = 255;
      }
    else
      {
        curColor [0] = 255;
        curColor [1] = 0;
        curColor [2] = decreasing;
      }
    };

function toHex (c)
  {
    var hex = c.toString (16);
    return hex.length ==1 ? "0" + hex : hex;
  };
