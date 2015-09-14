$(document).ready (function ()
  {
    var openerc, openerctx;
    openerc = document.getElementById ("open_color_picker_signup");
    openerctx = openerc.getContext ("2d");
    openerctx.fillStyle = $("#color").val ();
    openerctx.fillRect (0, 0, openerc.width, openerc.height);
    $("#signup_form").on ("ajax:success", function (event, data, status, xhr)
      {
        if (xhr.getResponseHeader ("signup-error") == "true")
          {
            signup_form = $(data).filter ("#signup_form_container").clone (true);
	    if ($("#signup_form_container") == null)
	      $("#signup_link").click ();
            $("#signup_form_container").remove ();
	    signup_form.appendTo ("#center_form");
	  }
        else if (xhr.getResponseHeader ("signup-error") == "false")
          {
  	    $("#exit_button").click ();
	    location.reload ();
	  }
	else
	  console.log ("Error recieving post_login header.");
      }); 
  });
