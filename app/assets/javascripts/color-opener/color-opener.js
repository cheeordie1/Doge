function ColorOpener (openerid, containerid, searchid)
  {
    this.openerid = openerid;
    this.containerid = containerid;
    this.searchid = searchid;
    this.openerc = document.getElementById (this.openerid);
    this.openerctx = this.openerc.getContext ("2d");
    this.openerctx.fillStyle = $("#color").val ();
    this.openerctx.fillRect (0, 0, this.openerc.width, this.openerc.height);
    var obj = this;

    $("#" + this.openerid).on ("click", function ()
      {
        $.ajax ({
          method: "GET",
          url: "http://localhost:3000/color",
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
  };
