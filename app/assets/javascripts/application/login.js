$(document).ready (function ()
  {
    var login_form;

    $("#login_link").on ("click", function ()
      {
	if ($("#login_form").length)
	  return;
	$.get("/login", function (data)
          {
	    login_form = $(data).filter ("#login_form").clone (true);
            login_form.appendTo ("body");
          });
      });
  });
