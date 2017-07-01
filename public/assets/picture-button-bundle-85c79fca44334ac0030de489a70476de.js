function makePictureButton (imageID, normalURL, 
                            highlightURL, pressedURL)
  {
    var obj = this;
    obj.imageFullID = "#" + imageID;
    obj.normalURL = normalURL;
    obj.highlightURL = highlightURL;
    obj.pressedURL = pressedURL;
    $(obj.imageFullID).on ("mouseover", function ()
      {
        $(obj.imageFullID).attr ("src", obj.highlightURL);
      });
    $(obj.imageFullID).on ("mouseout", function ()
      {
        $(obj.imageFullID).attr ("src", obj.normalURL);
      });
    $(obj.imageFullID).on ("mousedown", function ()
      {
        $(obj.imageFullID).attr ("src", obj.pressedURL);
      }); 
    $(obj.imageFullID).on ("mouseup", function ()
      {
        $(obj.imageFullID).attr ("src", obj.highlightURL);
      });
  };
