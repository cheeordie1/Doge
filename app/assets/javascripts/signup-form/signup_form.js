$(document).ready (function ()
  {
    var signup_form;
    $("#signup_form").on ("ajax:success", function (event, data, status, xhr)
      {
        if (xhr.getResponseHeader ("signup-error") == "true")
          {
            signup_form = $(data).filter ("#signup_form_container").clone (true);
	    if ($("#signup_form_container") == null)
	      $("#signup_link").click ();
            $("#signup_form_container").remove ();
	    for (var i = 0; i < 500; i++)
	      console.log ("goo");
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
