$(document).ready (function ()
  {
    // Make Script transport through ajax asynchronous
    $.ajaxPrefilter (function (options, originalOptions, jqXHR)
      {
        options.async = true;
      });

    $("#signup_link").on ("ajax:beforeSend", function (event, xhr, settings)
      {
        if ($("#signup_form_container").length)
          {  
            xhr.abort ();
	    return;
	  }
      });

    $("#login_link").on ("ajax:beforeSend", function (event, xhr, settings)
      {
        if ($("#login_form_container").length)
          {
            xhr.abort ();
	    return;
	  }
      });
   
    $("#signup_tab").on ("click", function ()
      {
        $("#signup_link").click ();
      });

    $("#login_tab").on ("click", function ()
      {
        $("#login_link").click ();
      });

    $("#signup_link").on ("ajax:success", function (event, data, status, xhr)
      {
       	login_form = $(data).filter ("#signup_form_container").clone (true);
	if ($("#login_form_container").length)
          $("#login_form_container").remove ();
	login_form.appendTo ("#center_form");
        $("#signup_tab").css ("border-color", "#333333");
        $("#login_tab").css ("border-color", "#888888");
        $("#login_tab").css ("border-bottom-color", "#333333");
	$("#signup_cover").css ("visibility", "visible");
	$("#login_cover").css ("visibility", "hidden");
        $("#ls_form_container").css ("display", "block");
      });

    $("#login_link").on ("ajax:success", function (event, data, status, xhr)
      {
       	login_form = $(data).filter ("#login_form_container").clone (true);
	if ($("#signup_form_container").length)
          $("#signup_form_container").remove ();
	login_form.appendTo ("#center_form");
        $("#login_tab").css ("border-color", "#333333");
        $("#signup_tab").css ("border-color", "#888888");
	$("#signup_tab").css ("border-bottom-color", "#333333");
	$("#login_cover").css ("visibility", "visible");
	$("#signup_cover").css ("visibility", "hidden");
        $("#ls_form_container").css ("display", "block");
      });
  });
