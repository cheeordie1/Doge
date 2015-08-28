$(document).ready (function ()
  {
    $("#login_form").on ("ajax:success", function (event, data, status, xhr)
      {
        $("#exit_button").click ();
        if (xhr.getResponseHeader ("login-error") == "true")
          $("#login_link").click ();
        else if (xhr.getResponseHeader ("login-error") == "false")
	  location.reload ();
	else
	  console.log ("Error recieving post_login header.");
      }); 
  });
