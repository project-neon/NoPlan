var fieldBotVertices = [
  { x:   0, y:-100 }, // NOTE:
  { x: 170, y:-100 }, // NOTE:
  { x: 170, y:   5 },
  { x:   0, y:   5 }
];
fieldBotVertices = scale(fieldBotVertices);
var fieldTopVertices = [
  { x:   0, y: 135 },
  { x: 170, y: 135 },
  { x: 170, y: 240 }, // NOTE:
  { x:   0, y: 240 }  // NOTE:
];
fieldTopVertices = scale(fieldTopVertices);
var fieldTopLeftVertices = [
  { x:-100, y:  90 }, // NOTE:
  { x:  15, y:  90 },
  { x:  15, y: 140 },
  { x:-100, y: 140 }  // NOTE:
];
fieldTopLeftVertices = scale(fieldTopLeftVertices);
var fieldTopRightVertices = [
  { x: 165, y:  90 },
  { x: 280, y:  90 }, // NOTE:
  { x: 280, y: 140 }, // NOTE:
  { x: 165, y: 140 }
];
fieldTopRightVertices = scale(fieldTopRightVertices);
var fieldBottomLeftVertices = [
  { x:-100, y:   0 }, // NOTE:
  { x:  15, y:   0 },
  { x:  15, y:  50 },
  { x:-100, y:  50 }  // NOTE:
];
fieldBottomLeftVertices = scale(fieldBottomLeftVertices);
var fieldBottomRightVertices = [
  { x: 165, y:   0 },
  { x: 280, y:   0 }, // NOTE:
  { x: 280, y:  50 }, // NOTE:
  { x: 165, y:  50 }
];
fieldBottomRightVertices = scale(fieldBottomRightVertices);
var fieldGoalLeftVertices = [
  { x:-100, y:  50 }, // NOTE:
  { x:   5, y:  50 },
  { x:   5, y:  90 },
  { x:-100, y:  90 }  // NOTE:
];
fieldGoalLeftVertices = scale(fieldGoalLeftVertices);
var fieldGoalRightVertices = [
  { x: 175, y:  50 },
  { x: 280, y:  50 }, // NOTE:
  { x: 280, y:  90 }, // NOTE:
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
