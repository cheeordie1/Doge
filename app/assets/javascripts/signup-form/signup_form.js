$(document).ready (function ()
  {
    $("#signup_form").on ("ajax:success", function (event, data, status, xhr)
      {
        $("#exit_button").click ();
        if (xhr.getResponseHeader ("signup-error") == "true")
          $("#signup_link").click ();
        else if (xhr.getResponseHeader ("signup-error") == "false")
	  location.reload ();
	else
	  console.log ("Error recieving post_login header.");
      }); 
  });
