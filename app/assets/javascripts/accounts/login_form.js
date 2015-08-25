$(document).ready (function ()
  {
    $("#exit_button").on ("mouseover", function ()
      {
        $("#exit_button").attr ("src", "assets/exit_highlight.png");
      });
    $("#exit_button").on ("mouseout", function ()
      {
        $("#exit_button").attr ("src", "assets/exit_normal.png");
      });
    $("#exit_button").on ("mousedown", function ()
      {
        $("#exit_button").attr ("src", "assets/exit_pressed.png");
      });
    $("#exit_button").on ("click", function ()
      {
        $("#login_form_container").remove ();
      });
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
