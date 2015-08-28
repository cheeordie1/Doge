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
	if ($("#login_form_container").length) 
          $("#login_form_container").remove ();
        else if ($("#signup_form_container").length)
	  $("#signup_form_container").remove ();
        $("#ls_form_container").css ("display", "none");
      });
  });
