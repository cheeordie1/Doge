$(document).ready(function ()
  {
    var msg, cur_msg, remaining, enter, shift,
        form, publication, username, color, tab_id, 
	cur_node, msg_id, i, postpend;
    shift = false;
    cur_msg = "";
    msg_id = 0;
    form = $("#rails_secure_form");
    msg = $("#msg");
    remaining = $("#remaining");
    remaining.innerHTML = "characters left 1024";
    tab_id = $("#tab_id").val ();
    username = $("#username").val ();
    color = $("#color").val ();

    function addMessage (username, text, color)
      {
        cur_node = document.getElementById ("chat-lines").appendChild (document.createElement ("div"));
	postpend = username + "-" + msg_id.toString ();
	// vulnerability if popular!!
	msg_id = (msg_id + 1) % 1000000;
        cur_node.id = postpend;
	cur_node = cur_node.appendChild (document.createElement ("li"));
	cur_node.id = "line-" + postpend;
	// add message nodes
        for (i = 0; i < 3; i++)
	  cur_node.appendChild (document.createElement ("span"));
	// write name
	cur_node = cur_node.childNodes [0];
	cur_node.id = "name-" + postpend;
	cur_node.innerHTML = username;
	cur_node.style.color = color;
	cur_node.style.fontSize = "18px";
        // write colon
	cur_node = cur_node.nextSibling;
	cur_node.id = "colon-" + postpend;
	cur_node.innerHTML = ":";
	cur_node.style.color = color;
	cur_node.style.fontSize = "18px";
	// write message
	cur_node = cur_node.nextSibling;
	cur_node.id = "message-" + postpend;
	cur_node.innerHTML = text;
	cur_node.style.color = "#000000";
	cur_node.style.fontSize = "15px";
      };

    PrivatePub.subscribe ("/woof", function (data){
      console.log (data.tabid);
      console.log (tab_id);
      if (data.tabid != tab_id)
        addMessage (data.username, data.deliverable_msg, data.color);
    });

    function sendMessage ()
      {
	addMessage (username, cur_msg, color);
	$("#deliverable_msg").val (cur_msg);        
	$("#rails_secure_form").submit ();
        msg.val("");
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