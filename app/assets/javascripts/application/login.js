var title_first = ["So", "Such", "Much", "How", "Many", "Very", "Moar"];
var title_second = ["Wow!", "Wow.", "Doge", "Cute!", "Amaze!", "Soft", "Cuddle", "Excite!", "Cool", "Happi", "Euphoric"];
var title_length, login_form, font_family, h_shadow, v_shadow, blur_radius;

var random_title = function ()
  {
    // 25/75 chance 0 or 1
    title_length = Math.random ();
    if (title_length <= 0.25)
      return title_second [Math.floor (Math.random () * title_second.length)];
    else
      return title_first [Math.floor (Math.random () * title_first.length)] + 
	     " " + 
	     title_second [Math.floor (Math.random () * title_second.length)];
  };

var random_color = function ()
  {
    return "#" + Math.floor (Math.random () * 0xFFFFFF).toString (16);
  };

var random_shadow = function ()
  {
    if (Math.random () >= 0.3)
      return "";
    else
      {
	h_shadow = Math.floor (Math.random () * 5) - 2;
        v_shadow = Math.floor (Math.random () * 5) - 2;
        blur_radius = Math.floor (Math.random () * 3) + 6;
	return h_shadow.toString () + "px " + v_shadow.toString () + "px " +
	       blur_radius.toString () + "px " + random_color ();
      }
  };

var font_families = ["Oswald", "Slabo", "Indie+Flower", "Dosis", "Yanone+Kaffeesatz",
                     "Playfair+Display", "Cabin", "Shadows+Into+Light", "Sigmar+One", 
		     "Orbitron", "Covered+By+Your+Grace", "Bangers"];
var WebFontConfig, random_font_family;

function load_random_font ()
  {
    random_font_family = font_families [Math.floor (Math.random () * font_families.length)];
    WebFontConfig = 
    {
      google:
        { 
          families: [ random_font_family + "::latin" ]
	}
    };
    $.get (('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js',
      function (data) { return true });
  };

load_random_font ();

$(document).ready (function ()
  {
    $("#doge_title").html (random_title ());
    $("#doge_title").css ("color", random_color ());
    font_family = "'" + random_font_family + "'";
    font_family.replace ("+", " ");
    $("#doge_title").css ("font-family", font_family);
    $("#doge_title").css ("text-shadow", random_shadow ())

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
        $("#signup_tab").css ("border-color", "#333333");
        $("#login_tab").css ("border-color", "#888888");
      });

    $("#login_link").on ("ajax:beforeSend", function (event, xhr, settings)
      {
        if ($("#login_form_container").length)
          {
            xhr.abort ();
	    return;
	  }
        $("#login_tab").css ("border-color", "#333333");
        $("#signup_tab").css ("border-color", "#888888");
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
	$("#login_cover").css ("visibility", "visible");
	$("#signup_cover").css ("visibility", "hidden");
        $("#ls_form_container").css ("display", "block");
      });
  });
