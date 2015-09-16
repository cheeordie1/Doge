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
        obj.openerctx.fillStyle = $("#color").val ();
        obj.openerctx.fillRect (0, 0, obj.openerc.width, obj.openerc.height);
      });

    $("#" + this.openerid).on ("click", function ()
      {
        $.ajax ({
          method: "GET",
          url: "/color",
          beforeSend: function (xhr)
            {
              if ($("#" + obj.searchid).length)
                xhr.abort ();
            },
          success: function (data)
            {
              var color_pick = $(data).filter ("#" + obj.searchid).clone (true);
              color_pick.appendTo ("#" + obj.containerid);
	      $(document).bind ("click", obj.removePicker);
            }
	});
      });

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
            $("#color").val (newColor);
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
