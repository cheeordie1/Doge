function loadContainer (data, loadToContainerID, loadFromContainerID,
                        optionalRemoveID, optionalSuccessFunction)
  {
    var content = $(data).filter (loadFromContainerID).clone (true);
    if (optionalRemoveID != null)
      {
	      if ($(optionalRemoveID).length)
          $(optionalRemoveID).remove ();
      }
    if ($(loadFromContainerID).length == 0)
      {
	      content.appendTo (loadToContainerID);
      }
    if (optionalSuccessFunction != null)
      {
        optionalSuccessFunction ();
      }
    content = null;
  };

function ContainerLoader (ajaxLinkID, ajaxLink, loadToContainerID, 
                          loadFromContainerID, optionalRemoveID, 
                          optionalSuccessFunction)
  {
    var obj = this;
    obj.ajaxLink = ajaxLink == null ? null : ajaxLink;
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
            method: "GET",
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
