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
function ColorOpener (openerid, containerid, searchid)
  {
    var obj = this;
    this.openerid = openerid;
    this.containerid = containerid;
    this.searchid = searchid;
    $(document).ready (function ()
      {
        obj.openerc = document.getElementById (obj.openerid);
        obj.openerctx = obj.openerc.getContext ("2d");
        obj.openerctx.fillStyle = $("#current_account_color").val ();
        obj.openerctx.fillRect (0, 0, obj.openerc.width, obj.openerc.height);
      });

    obj.onPickerLoad = function ()
      {
	      $(document).bind ("click", obj.removePicker);
      };

    obj.pickerLoader = new ContainerLoader (null, "/color", "GET", null, obj.containerid, 
                                            obj.searchid, null, obj.onPickerLoad);

    $("#" + this.openerid).on ("click", obj.pickerLoader.openContainer);

    this.removePicker = function (evt)
      {
        if (!$(evt.target).closest ("#" + obj.searchid).length)
          {
            $("#" + obj.searchid).remove ();
            $(document).unbind ("click", obj.removePicker);
	        };
      };

    this.bindSubmission = function (formid)
      {
	      $("#" + formid).on ("ajax:success", function (event, data, status, xhr)
          {
            var newColor = xhr.getResponseHeader ("color");
            $("#current_account_color").val (newColor);
	          $("#username_top").css ("color", newColor);
          });
        obj.removePicker = function (evt)
          {
            if (!$(evt.target).closest ("#" + obj.searchid).length)
              {
                $("#" + obj.searchid).remove ();
                $(document).unbind ("click", obj.removePicker);
		            $("#" + formid).trigger ("submit.rails");
              };
          };
      };
  };


