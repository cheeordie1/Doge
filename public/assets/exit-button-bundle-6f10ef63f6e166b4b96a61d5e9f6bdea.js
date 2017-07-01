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
function makeExitButton (buttonContainerID, formContainerID, 
                         normalURL, highlightURL, pressedURL)
  {
    var obj = this;
    obj.buttonContainerID = "#" + buttonContainerID;
    obj.formContainerID = "#" + formContainerID;
    obj.exitButton = new makePictureButton ("exit_button", normalURL, 
                                            highlightURL, pressedURL);
    $(obj.buttonContainerID).on ("click", function ()
      {
        if ($(obj.formContainerID).length) 
          $(obj.formContainerID).remove ();
      });

    obj.bindClick = function (clickHandle) {
      $(obj.buttonContainerID).on ("click", function () {
        clickHandle ();
      });
    };
  };


