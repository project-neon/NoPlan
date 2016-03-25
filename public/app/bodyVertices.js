var fieldBotVertices = [
  { x:   0, y:   0 },
  { x: 170, y:   0 },
  { x: 170, y:   5 }, //right-bottom corner
  { x:   0, y:   5 }  //left-bottom corner
];
fieldBotVertices = scale(fieldBotVertices);
var fieldTopVertices = [
  { x:   0, y: 135 },
  { x: 170, y: 135 },
  { x: 170, y: 140 }, //right-top corner
  { x:   0, y: 140 }  //left-top corner
];
fieldTopVertices = scale(fieldTopVertices);
var fieldTopLeftVertices = [
  { x:   0, y:  90 },
  { x:  15, y:  90 },
  { x:  15, y: 135 },
  { x:   0, y: 135 }
];
fieldTopLeftVertices = scale(fieldTopLeftVertices);
var fieldTopRightVertices = [
  { x: 165, y:  90 },
  { x: 180, y:  90 },
  { x: 180, y: 135 },
  { x: 165, y: 135 }
];
fieldTopRightVertices = scale(fieldTopRightVertices);
var fieldBottomLeftVertices = [
  { x:   0, y:   5 },
  { x:  15, y:   5 },
  { x:  15, y:  50 },
  { x:   0, y:  50 }
];
fieldBottomLeftVertices = scale(fieldBottomLeftVertices);
var fieldBottomRightVertices = [
  { x: 165, y:   5 },
  { x: 180, y:   5 },
  { x: 180, y:  50 },
  { x: 165, y:  50 }
];
fieldBottomRightVertices = scale(fieldBottomRightVertices);
var fieldGoalLeftVertices = [
  { x:   0, y:  50 },
  { x:   5, y:  50 },
  { x:   5, y:  90 },
  { x:   0, y:  90 }
];
fieldGoalLeftVertices = scale(fieldGoalLeftVertices);
var fieldGoalRightVertices = [
  { x: 175, y:  50 },
  { x: 180, y:  50 },
  { x: 180, y:  90 },
  { x: 175, y:  90 }
];
fieldGoalRightVertices = scale(fieldGoalRightVertices);

// NOTE: Scales and loop to resize field array_size
function scale(fieldVertices){
  var fieldHeight = 140;
  var fieldWidth  = 180;
  var yScale = 600/140;
  var xScale = (fieldWidth*600/fieldHeight)/180;
  for(var i=0; i<fieldVertices.length; i++){
    fieldVertices[i].x *= xScale;
    fieldVertices[i].y *= yScale;
  }
  return fieldVertices;
}
