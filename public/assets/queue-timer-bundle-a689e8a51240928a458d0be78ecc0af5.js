// Queue Timer makes a timer that ticks to 0 and sets up a tennis-ball 
// controller when the timer ticks to 0
function QueueTimer (objContainerID, timerSeconds)
  {
    var obj = this;
    timerSeconds = timerSeconds == "" ? 0 : parseInt(timerSeconds);
    obj.objContainerID = "#" + objContainerID;
    obj.timer = new Timer (objContainerID, timerSeconds);

    obj.controlLoader = new ContainerLoader (null, "/doge_control", "GET", null,
                                             "queue_container", "doge_control_container",
                                             "doge_queue_container", null);

    // Make Ajax request to set up controls when timer is out
    obj.timerUpFunction = function () {
      obj.controlLoader.openContainer ();
    };

    // Set timer to run timerUpFunction when timer runs out
    obj.timer.registerTimeOut (obj.timerUpFunction);
  };
// Timer creates an object that can render a timer on screen
function Timer (timerContainerID, timerSeconds)
  {
    var obj = this;
    obj.timerContainerID = "#" + timerContainerID;
    obj.minutes = Math.floor (timerSeconds / 60);
    obj.seconds = timerSeconds % 60;
    obj.minuteTimerNumber = new TimerNumber (obj.minutes, 0);
    obj.secondsTimerNumber = new TimerNumber (obj.seconds, 59);
    obj.timerOutHandler = function () {};

    // Render the timer html
    obj.$timerDiv = $("<div class='timerDivContainer hori-center'></div>");
    $(obj.timerContainerID).append (obj.$timerDiv);
    obj.$timerDiv.append ($(obj.minuteTimerNumber.getHTML ()));
    obj.$timerDiv.append ("<div class='timerDiv'>" + 
                          "<img class='timerColon' src='/assets/colon.png'>" + 
                          "</div>");
    obj.$timerDiv.append ($(obj.secondsTimerNumber.getHTML ()));

    // Set up a timer function to be called when timer ticks to 0
    // Only start the timer after the function is registered
    obj.registerTimeOut = function (timerOutHandler) {
      obj.timerOutHandler = timerOutHandler;
      obj.timerTickHandle = setInterval (obj.tickTimer, 1000);
    };

    // Function to decrement minutes and seconds left in timer
    obj.tickTimer = function () {
      if (obj.secondsTimerNumber.isOut ())
        {
          if (obj.minuteTimerNumber.isOut ())
            {
              // Stop decrementing if timer is 00:00
              clearInterval (obj.timerTickHandle);
              obj.timerOutHandler ();
              return;
            }
          else
            {
              // If seconds timer is 00, decrement minute timer
              obj.minuteTimerNumber.decrement (true);
            }
        }
      // Decrement seconds timer every tick
      if (obj.minuteTimerNumber.isOverBig ()) 
        {
          obj.secondsTimerNumber.decrement (false);
        }
      else
        {
          obj.secondsTimerNumber.decrement (true);
        }
    };
  };
function TimerNumber (timerStartNumber, timerWrapNumber)
  {
    var obj = this;
    obj.timerWrapNumber = timerWrapNumber >= 100 ? 99 : timerWrapNumber;
    obj.currentTimerNumber = timerStartNumber;

    // Create Number graphic which can be retrieved by clients
    obj.$timerNumberDiv = $("<div class='timerDiv'></div>");
    obj.$timerNumberDivLeft = $("<div class='timerNumberDiv'></div>");
    obj.$timerNumberLeft = $("<img class='timerNumber '>");
    obj.$timerNumberDivLeft.append (obj.$timerNumberLeft);
    obj.$timerNumberDiv.append (obj.$timerNumberDivLeft);
    obj.$timerNumberDivRight = $("<div class='timerNumberDiv'></div>");
    obj.$timerNumberRight = $("<img class='timerNumber '>");
    obj.$timerNumberDivRight.append (obj.$timerNumberRight);
    obj.$timerNumberDiv.append (obj.$timerNumberDivRight);


    // Function for client to retrieve html for timer number
    obj.getHTML = function () {
      return obj.$timerNumberDiv;
    };

    // Function to update html to render the current number
    obj.renderNumber = function () {
      var numberToRender = obj.currentTimerNumber > 99 ? 
                           99 : obj.currentTimerNumber;
      obj.rightDigit = numberToRender % 10;
      obj.leftDigit = (Math.floor (numberToRender / 10)) % 10;
      obj.$timerNumberRight.attr ("src", gon.timerNumberURLs [obj.rightDigit]);
      obj.$timerNumberLeft.attr ("src", gon.timerNumberURLs [obj.leftDigit]);
    };

    // Check if timer fits in two digit box
    obj.isOverBig = function () {
      return obj.currentTimerNumber > 99;
    };

    // Check if timer has run out
    obj.isOut = function () {
      if (obj.currentTimerNumber <= 0) 
        {
          obj.currentTimerNumber = 0;
          return true;
        }
      return false;
    };

    // Decrement the timer by one number. If timer is 0, wrap around
    obj.decrement = function (reRender) {
      obj.currentTimerNumber--;
      if (obj.currentTimerNumber < 0)
        {
          obj.currentTimerNumber = obj.timerWrapNumber;
        }
      if (reRender)
        {
          obj.renderNumber ();
        }
    };

    // Update the empty Number graphic to show the proper images
    obj.renderNumber ();
  };
