function loadContainer (data, loadToContainerID, loadFromContainerID,
                        optionalRemoveID, optionalSuccessFunction)
  {
    var $content = $(loadFromContainerID, $('<body>').html ($(data)));
    // If the received html is empty, do not use it
    if ($content.length == 0) {
      return;
    }
    // Remove an html element if specified
    if (optionalRemoveID != null)
      {
	      if ($(optionalRemoveID).length)
          $(optionalRemoveID).remove ();
      }
    // If the data is not already in the dom, add it
    if ($(loadFromContainerID).length == 0)
      {
	      $(loadToContainerID).append ($content);
      }
    // If there is any other function to call, call it
    if (optionalSuccessFunction != null)
      {
        optionalSuccessFunction ();
      }
    content = null;
  };

function ContainerLoader (ajaxLinkID, ajaxLink, method, data, 
                          loadToContainerID, loadFromContainerID,
                          optionalRemoveID, optionalSuccessFunction)
  {
    var obj = this;
    obj.ajaxLink = ajaxLink == null ? null : ajaxLink;
    obj.method = method;
    obj.data = data;
    obj.ajaxLinkID = ajaxLinkID == null ? null : "#" + ajaxLinkID;
    obj.loadToContainerID = "#" + loadToContainerID;
    obj.loadFromContainerID = "#" + loadFromContainerID;
    obj.optionalRemoveID = optionalRemoveID == null ? null : "#" + optionalRemoveID;
    obj.optionalSuccessFunction = optionalSuccessFunction;
    
    if (obj.ajaxLinkID != null)
      {
        // We have an <a> link getting clicked
        $(obj.ajaxLinkID).on ("ajax:beforeSend", function (event, xhr, settings)
          {
            if ($(obj.loadFromContainerID).length)
              {
                xhr.abort ();
              }
          });

        $(obj.ajaxLinkID).on ("ajax:success", function (event, data, status, xhr)
          {
       	    loadContainer (data, obj.loadToContainerID, obj.loadFromContainerID,
                           obj.optionalRemoveID, obj.optionalSuccessFunction);
          });
      }
    else
      {
        // We make our own ajax request because a non-<a> is getting clicked
        obj.openContainer = function ()
          {
            $.ajax ({
            method: obj.method,
            data: obj.data,
            url: obj.ajaxLink,
            beforeSend: function (xhr)
              {
                if ($(obj.loadFromContainerID).length)
                  {
                    xhr.abort ();
                  }
              },  
            success: function (data)
              {
                loadContainer (data, obj.loadToContainerID, obj.loadFromContainerID,
                               obj.optionalRemoveID, obj.optionalSuccessFunction);
              },
            });  
          };      
      }
  };
$(document).ready (function ()
  {
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

    var signupContainerLoader = new ContainerLoader ("signup_link", null, null, 
                                                     null, "center_form",
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

    var loginContainerLoader = new ContainerLoader ("login_link", null, null,
                                                    null, "center_form",
                                                    "login_form_container",
                                                    "signup_form_container",
                                                    afterLoginLoad);
  });
var title_first = ["So", "Such", "Much", "How", "Many", "Very", "Moar"];
var title_second = ["Wow!", "Wow.", "Doge", "Cute!", "Amaze!", "Soft", "Cuddle", "Excite!", "Cool", "Happi", "Euphoric", "Shibe", "Bow", "Bark", "Woof"];
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
    $("#doge_title").css ("text-shadow", random_shadow ());
  });



