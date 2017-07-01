function loadContainer (data, loadToContainerID, loadFromContainerID,
                        optionalRemoveID, optionalSuccessFunction)
  {
    var $content = $(loadFromContainerID, $('<body>').html ($(data)));
    // If the received html is empty, do not use it
    if ($content.length == 0) {
      return;
    }
    // Remove an html element if specified
    if (optionalRemoveID != null)
      {
	      if ($(optionalRemoveID).length)
          $(optionalRemoveID).remove ();
      }
    // If the data is not already in the dom, add it
    if ($(loadFromContainerID).length == 0)
      {
	      $(loadToContainerID).append ($content);
      }
    // If there is any other function to call, call it
    if (optionalSuccessFunction != null)
      {
        optionalSuccessFunction ();
      }
    content = null;
  };

function ContainerLoader (ajaxLinkID, ajaxLink, method, data, 
                          loadToContainerID, loadFromContainerID,
                          optionalRemoveID, optionalSuccessFunction)
  {
    var obj = this;
    obj.ajaxLink = ajaxLink == null ? null : ajaxLink;
    obj.method = method;
    obj.data = data;
    obj.ajaxLinkID = ajaxLinkID == null ? null : "#" + ajaxLinkID;
    obj.loadToContainerID = "#" + loadToContainerID;
    obj.loadFromContainerID = "#" + loadFromContainerID;
    obj.optionalRemoveID = optionalRemoveID == null ? null : "#" + optionalRemoveID;
    obj.optionalSuccessFunction = optionalSuccessFunction;
    
    if (obj.ajaxLinkID != null)
      {
        // We have an <a> link getting clicked
        $(obj.ajaxLinkID).on ("ajax:beforeSend", function (event, xhr, settings)
          {
            if ($(obj.loadFromContainerID).length)
              {
                xhr.abort ();
              }
          });

        $(obj.ajaxLinkID).on ("ajax:success", function (event, data, status, xhr)
          {
       	    loadContainer (data, obj.loadToContainerID, obj.loadFromContainerID,
                           obj.optionalRemoveID, obj.optionalSuccessFunction);
          });
      }
    else
      {
        // We make our own ajax request because a non-<a> is getting clicked
        obj.openContainer = function ()
          {
            $.ajax ({
            method: obj.method,
            data: obj.data,
            url: obj.ajaxLink,
            beforeSend: function (xhr)
              {
                if ($(obj.loadFromContainerID).length)
                  {
                    xhr.abort ();
                  }
              },  
            success: function (data)
              {
                loadContainer (data, obj.loadToContainerID, obj.loadFromContainerID,
                               obj.optionalRemoveID, obj.optionalSuccessFunction);
              },
            });  
          };      
      }
  };
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
function makeFakeQueueButton (buttonID, signupLinkID) {
  var obj = this;
  obj.buttonID = "#doge_bootun";
  obj.signupLinkID = "#signup_link";
  $(obj.buttonID).click (function (evt) {
    obj.oldURL = $(obj.signupLinkID).attr ("href");
    $(obj.signupLinkID).attr ("href", obj.oldURL + ((obj.oldURL.indexOf('?')!=-1)?'&':'?') +
                                "special_message=" + encodeURI ("Register an account before you Doge"));
    $(obj.signupLinkID).click ();
    $(obj.signupLinkID).attr ("href", obj.oldURL);
  });
};

function makeQueueButton () {
  var obj = this;

  obj.queueLoader = new ContainerLoader (null, "/doge_enqueue", "POST", null,
                                         "queue_container", "doge_queue_container",
                                         "button_container", null);

  $("#doge_bootun").click (obj.queueLoader.openContainer);
}
;



