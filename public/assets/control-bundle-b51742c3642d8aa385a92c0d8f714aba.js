function makeControl (controlContainerID, controlFormID, controlRadius)
  {
    var obj = this;
    obj.controlFireButtonRadius = controlRadius;
    obj.controlSelectorRadius = 12;
    obj.controlSelectorAngle = 190;
    obj.controlCanvasHeight = 2 * obj.controlFireButtonRadius + 
                              obj.controlSelectorRadius + 25;
    obj.controlCanvasWidth = obj.controlCanvasHeight; 
    obj.controlFormID = "#" + controlFormID;
    obj.controlContainerID = "#" + controlContainerID;
    obj.$controlContainer = $(obj.controlContainerID);
    obj.controlCanvasID = "controlCanvas";
    obj.controlCanvasClass = "controlCanvas";
    obj.$controlCanvas = $("<canvas id='" + obj.controlCanvasID + 
                           "' class='" + obj.controlCanvasClass + 
                           "' width=" + obj.controlCanvasWidth +
                           " height=" + obj.controlCanvasHeight +
                           "></canvas>");
    obj.$controlCanvas.prependTo (obj.$controlContainer);

    // Setup Control Graphics
		paper.setup(obj.$controlCanvas.get (0));

    // Draw Button Circle
    obj.controlCenter = new paper.Point (obj.controlCanvasWidth / 2, 
                                         obj.controlCanvasHeight / 2);
    obj.controlBounds = new paper.Shape.Circle (obj.controlCenter, 
                                                obj.controlFireButtonRadius);
    obj.controlFireButton = new PaperPictureButton (new paper.Size (110, 110), 
                                                    obj.controlCenter.subtract (new paper.Point (2.5, 0)),
                                                    obj.controlBounds,
                                                    "/assets/doge_bootun_normal.png",
                                                    "/assets/doge_bootun_highlight.png",
                                                    "/assets/doge_bootun_pressed.png");

    // TODO Move Angle Selector out of file to a new class for cleanliness

    // Draw Angle Selector Background Arc
    obj.drawArc = function (center, radius, angle) 
      {
        var innerArcCenter = center.subtract (new paper.Point (0,
                                              obj.controlFireButtonRadius));
        
        var outerArcCenter = innerArcCenter.subtract (new paper.Point (0, 
                                                      radius));
        var selectorHalfAngle = angle / 2;
        // Inner Arc
        var innerArcLeft = innerArcCenter.rotate (-selectorHalfAngle, center);
        var innerArcRight = innerArcCenter.rotate (selectorHalfAngle, center);
        // Outer Arc
        var outerArcLeft = outerArcCenter.rotate (-selectorHalfAngle, center);
        var outerArcRight = outerArcCenter.rotate (selectorHalfAngle, center);
        // Make Path for Arc
        var arcPath = new paper.Path ();
        arcPath.add (innerArcLeft);
        arcPath.arcTo (innerArcCenter, innerArcRight);
        arcPath.lineTo (outerArcRight);
        arcPath.arcTo (outerArcCenter, outerArcLeft);
        arcPath.closed = true;
        arcPath.fillColor = 'rgba(46,44,44,0.5)'; 
        return arcPath;
      };

    obj.controlSelectorArc = obj.drawArc (obj.controlCenter, 
                                          obj.controlSelectorRadius,
                                          obj.controlSelectorAngle);

    // Draw Angle Selector
    obj.makeSelector = function (center, distFromCenter, radius)
      {
        var selectorWidth = 10;
        var selectorHeight = radius + 4;
        var selectorCornerRadius = 3;
        var selectorSize = new paper.Size (selectorWidth, selectorHeight);
        var selectorCornerSize = new paper.Size (selectorCornerRadius, 
                                                 selectorCornerRadius);
        var corner = center.subtract (new paper.Point (selectorWidth / 2, 
                                                       distFromCenter + 2));
        var selector = new paper.Rectangle (corner, selectorSize);
        var selector = new paper.Path.Rectangle (selector, selectorCornerSize);
        selector.fillColor = '#000000';
        return selector;
      };

    obj.controlSelector = obj.makeSelector (obj.controlCenter,
                                            obj.controlFireButtonRadius + 
                                            obj.controlSelectorRadius,
                                            obj.controlSelectorRadius);

    // Make Angle Selector Move on mouse drag
    obj.getSelectorAngle = function () {
      var vecToSelector = obj.controlSelector.position.subtract (obj.controlCenter);
      return new paper.Point (0, -1).getDirectedAngle (vecToSelector);
    }

    obj.controlSelector.on ('mousedrag', function (event) {
      var vecDragTo = event.point.subtract (obj.controlCenter);
      var vecDragFrom = obj.controlSelector.position.subtract (obj.controlCenter);
      var deltaAngle = vecDragFrom.getDirectedAngle (vecDragTo);
      var centerAngle = new paper.Point (0, -1).getDirectedAngle (vecDragFrom);
      var controlHalfAngle = obj.controlSelectorAngle / 2;
      if ((centerAngle + deltaAngle) < -controlHalfAngle)
        {
          var vecLimit = new paper.Point (0, -1).rotate (-controlHalfAngle);
          deltaAngle = vecDragFrom.getDirectedAngle (vecLimit);
        }
      else if ((centerAngle + deltaAngle) > controlHalfAngle)
        {
          var vecLimit = new paper.Point (0, -1).rotate (controlHalfAngle);
          deltaAngle = vecDragFrom.getDirectedAngle (vecLimit);
        }
      obj.controlSelector.rotate (deltaAngle, obj.controlCenter);
    });

    // Make Angle Selector change color on mouseover
    obj.controlSelector.on ('mousedown', function (event) {
      obj.controlSelector.strokeColor = '#fffc56';
    });

    obj.controlSelector.on ('mousedrag', function (event) {
      obj.controlSelector.strokeColor = '#fffc56';
    });

    obj.controlSelector.on ('mouseenter', function (event) {
      obj.controlSelector.strokeColor = '#fffc56';
    });

    obj.controlSelector.on ('mouseleave', function (event) {
      obj.controlSelector.strokeColor = '';
    });

    obj.controlSelector.on ('mouseup', function (event) {
      obj.controlSelector.strokeColor = '';
    });

    // Function that adds an input to the control form and sends it, removing
    // the input element after submitting the form.
    obj.submitControlSignal = function (name, value) {
      var $controlSignalData = $("<input name='" + name + "' type='hidden'>");
      var $controlSignalDataContainer = $("<div>");
      $controlSignalDataContainer.append ($controlSignalData);
      $controlSignalData.val (value);
      $(obj.controlFormID).append ($controlSignalDataContainer);
      $(obj.controlFormID).submit ();
      $controlSignalDataContainer.remove ();
    };

    // Bind fire signal to fire button
    obj.controlFireSignal = function () {
      obj.submitControlSignal ('fire', true);
    };
    obj.controlFireButton.bindClick (obj.controlFireSignal);

    // Make Angle Selector submit a form on angle change
    obj.controlSelector.on ('mouseup', function (event) {
      var angle = obj.getSelectorAngle ();
      obj.submitControlSignal ('angle', angle);
    }); 

  };
