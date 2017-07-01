$(document).ready (function ()
  {
    var msg, enter, shift,
        form, publication, username, color, tab_id, 
	      cur_node, msg_id, i, postpend, scrolled, height;
    shift = false;
    msg_id = 0;
    form = $("#rails_secure_form");
    msg = $("#msg");
    $("#remaining").html ("characters left 1024");
    tab_id = $("#tab_id").val ();
    username = $("#current_account_username").val ();

    function addMessage (username, text, color)
      {
	      height =  $("#chat-lines")[0].scrollHeight - $("#chat-lines")[0].clientHeight;
	      scrolled = height - $("#chat-lines").scrollTop () < 2;
        cur_node = document.getElementById ("chat-lines").appendChild (document.createElement ("div"));
	      postpend = username + "-" + msg_id.toString ();
	      // vulnerability if popular!!
	      msg_id = (msg_id + 1) % 1000000;
        cur_node.id = postpend;
	      cur_node = cur_node.appendChild (document.createElement ("li"));
	      cur_node.id = "line-" + postpend;
        $(cur_node).addClass ("chat-message-container");
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
        $(cur_node).addClass ("chat-message-payload");
	      cur_node.innerHTML = text;
	      cur_node.style.color = "#000000";
	      cur_node.style.fontSize = "15px";
	      if (scrolled)
          $("#chat-lines").scrollTop ($("#chat-lines")[0].scrollHeight);
      };

    PrivatePub.subscribe ("/woof", function (data)
      {
        if (data.tabid != tab_id)
          addMessage (data.username, data.deliverable_msg, data.color);
      });

    function sendMessage ()
      {
        cur_msg = msg.val ();
	      addMessage (username, cur_msg, $("#current_account_color").val ());
	      $("#deliverable_msg").val (cur_msg);        
	      $("#rails_secure_form").trigger ('submit.rails');
        msg.val("");
      };

    $(send)[0].onclick = sendMessage;
    
    $("textarea").on ('keydown', function (evt)
      {
	      if (evt.keyCode == 16)
	        shift = true;
      });

    $("textarea").on ('keyup', function (evt){
      if (evt.keyCode == 16)
        shift = false;
    });

    $("textarea").on ('keypress keyup paste', function (evt)
      {
	      msg.maxLength = "1024";
	      if (evt.keyCode == 13 && !shift)
          {
	          if (evt.type == "keypress")
	            sendMessage ();
            evt.preventDefault ();
	        }
        remaining.innerHTML = "characters left " + (1024 - msg.val ().length);
      });
  });
