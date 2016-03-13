// Matter.js module aliases
var Engine = Matter.Engine,
    World  = Matter.World,
    Bodies = Matter.Bodies;

// NOTE: Values of VSS Field in centimeters
var fieldHeight = 130;
var fieldWidth  = 150;
var fieldFWidth = 170; //width with goal size in both sides
var fieldOffset =  10; // padding between field limits and canvas size

// NOTE: Canvas size in pixels
var canvasHeight = 600;
var canvasWidth  = fieldWidth*canvasHeight/fieldHeight;
var diameter     = 40*canvasHeight/fieldHeight;
var ballSize     = 0.427*canvasHeight/fieldHeight;

// create a Matter.js engine
var engine = Engine.create({
  render: {
    element: document.getElementById('showField'),
    controller: Matter.RenderPixi, //Uses Pixi.js as renderer
    options: {
      width: canvasWidth,
      height: canvasHeight
    }
  }
});

var fieldLeft   = Bodies.rectangle(canvasWidth/2 - canvasWidth/4 + 5, canvasHeight/2, canvasWidth/2 - 10, canvasHeight-10, { isStatic: true });
var fieldRight  = Bodies.rectangle(canvasWidth/2 + canvasWidth/4 - 5, canvasHeight/2, canvasWidth/2 - 10, canvasHeight-10, { isStatic: true });
var fieldMiddle = Bodies.circle(canvasWidth/2, canvasHeight/2, diameter/2, { isStatic: true });
var fieldBall   = Bodies.circle(canvasWidth/2, canvasHeight/2, ballSize, { isStatic: true });
// add all of the bodies to the world
// World.add(engine.world, [boxA, boxB, ground]);
World.add(engine.world, [fieldLeft, fieldRight, fieldMiddle, fieldBall]);

// run the engine
Engine.run(engine);
