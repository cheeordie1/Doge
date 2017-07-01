function makeGenericTimer (timerContainerID, seconds, minutes, hours)
  {
    var obj = this;
  
    console.log (minutes);

    // Local variables
    obj.timerContainerID = timerContainerID == null ? null : "#" + timerContainerID;
  
    obj.seconds = seconds;
    obj.minutes = minutes;
    obj.hours = hours;

    obj.timeoutFunc = null;
  
    // Tick function called every second
    obj.tick = function () {

      if (obj.timerContainerID != null) {
        obj.render ();
      }

      if (obj.isTimeOut ()) {
        clearInterval (obj.tickInterval);
        if (obj.timeoutFunc != null) {
          obj.timeoutFunc ();
        }
        return;
      }
  
      if (obj.seconds <= 0) {
        obj.seconds = 59;
        if (obj.minutes > 0) {
          obj.minutes--;
        } else {
          if (obj.hours > 0) {
            obj.hours--;
            obj.minutes = 59;
          }
        }
      } else {
        obj.seconds--;
      }
    };
  
    // return a number in timer format
    obj.timerNumberToString = function (number) {
      if (number <= 0) {
        return "00";
      } else if (number < 10) {
        return "0" + number;
      } else {
        return number;
      }
    };
  
    // toString function to return string version of timer
    obj.toString = function () {
      var out = "";
      out += obj.timerNumberToString (obj.hours) + ":" +
             obj.timerNumberToString (obj.minutes) + ":" +
             obj.timerNumberToString (obj.seconds);
      return out;
    }; 
  
    // Render function to display timer
    obj.render = function () {
      $(obj.timerContainerID).text (obj.toString ());
    };

    obj.isTimeOut = function () {
      if (obj.seconds <= 0 && obj.minutes <= 0 && obj.hours <= 0) {
        return true;
      }
      return false;
    };

    // Bind function to be executed on timeout
    obj.bindTimeout = function (func) {
      obj.timeoutFunc = func;
    };
  
    // Initiate the tick function
    obj.tickInterval = setInterval (obj.tick, 1000);

  };
