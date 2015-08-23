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
        $("#login_form").remove ();
      });    
  });
