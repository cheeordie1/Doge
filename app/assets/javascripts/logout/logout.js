$(document).ready (function () 
  {
    $("#logout_link").on ("ajax:success", function (event, data, status, xhr)
      {
        location.reload ();
      });
  });
