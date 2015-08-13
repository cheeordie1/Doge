var fayeling;
$(document).ready(function ()
  {
    var msg, cur_msg, remaining, enter, shift,
        form, publication;
    shift = false;
    cur_msg = "";
    form = $("#rails_secure_form");
    msg = $("#msg");
    remaining = $("#remaining");
    remaining.innerHTML = "characters left 1024";

    PrivatePub.subscribe ("/woof", function (data){
      console.log ("The message: " + data.deliverable_msg + "\nShould have been received.");
    });

    function sendMessage ()
      {
	$("#deliverable_msg").val (cur_msg);
	$("#rails_secure_form").submit ();
        msg.val("");
        console.log ("MESSAGE CONTAINS: " + cur_msg);
      };

    $(send)[0].onclick = sendMessage;
    
    $("textarea").on ('keydown', function (evt){
      switch (evt.keyCode)
      {
        case 16:
          shift = true;
  	  break;
      }; 
    });

    $("textarea").on ('keyup', function (evt){
      switch (evt.keyCode)
      {
        case 16:
          shift = false;
  	  break;
      }; 
    });

    $("textarea").on ('keypress keyup paste', function (evt)
      {
	msg.maxLength = "1024";
	if (evt.keyCode == 13 && !shift)
          {
	    msg.val ("");
	    if (evt.type == "keypress")
	      {
	        sendMessage ();
	      }
	  }
        cur_msg = msg.val ();
        remaining.innerHTML = "characters left " + (1024 - msg.val ().length);
      });
  });
