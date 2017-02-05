$(document).ready (function ()
  {
    // Make Script transport through ajax asynchronous
    $.ajaxPrefilter (function (options, originalOptions, jqXHR)
      {
        options.async = true;
      });

    $("#signup_tab").on ("click", function ()
      {
        $("#signup_link").click ();
      });

    $("#login_tab").on ("click", function ()
      {
        $("#login_link").click ();
      });

    var afterSignupLoad = function ()
      {
        $("#signup_tab").css ("border-color", "#333333");
        $("#login_tab").css ("border-color", "#888888");
        $("#login_tab").css ("border-bottom-color", "#333333");
	      $("#signup_cover").css ("visibility", "visible");
	      $("#login_cover").css ("visibility", "hidden");
        $("#ls_form_container").css ("display", "block");
      };

    var signupContainerLoader = new ContainerLoader ("signup_link", null, "center_form",
                                                     "signup_form_container", 
                                                     "login_form_container", 
                                                     afterSignupLoad);

    var afterLoginLoad = function ()
      {
        $("#login_tab").css ("border-color", "#333333");
        $("#signup_tab").css ("border-color", "#888888");
	      $("#signup_tab").css ("border-bottom-color", "#333333");
	      $("#login_cover").css ("visibility", "visible");
	      $("#signup_cover").css ("visibility", "hidden");
        $("#ls_form_container").css ("display", "block");
      };

    var loginContainerLoader = new ContainerLoader ("login_link", null, "center_form",
                                                    "login_form_container",
                                                    "signup_form_container",
                                                    afterLoginLoad);
  });
