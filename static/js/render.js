
const REAL_WORLD_FIELD_HEIGHT = 1300; //canvasH
const REAL_WORLD_FIELD_WIDTH  = 1700; //canvasW


var canvas_width  = 750;
let scale         = canvas_width / REAL_WORLD_FIELD_WIDTH;
var canvas_height = scale * REAL_WORLD_FIELD_HEIGHT;
var xCenter       = canvas_width / 2;
var yCenter       = canvas_height / 2;

let Engine = Matter.Engine,
    World  = Matter.World,
    Bodies = Matter.Bodies;

let engine;
let world;
let canvas;
let boxes = [];
let background_image;

var ground;

function setup() {

    canvas = createCanvas(canvas_width, canvas_height);
    canvas.parent("div_field_container");

    background_image = loadImage("/img/field.png");

    engine = Engine.create();
    world = engine.world;

    Engine.run(engine);

    ground = Bodies.rectangle(176, 958, 958, 100, {isStatic: true});
    World.add(world, ground);

}

function mousePressed() {
    boxes.push(new n_box(mouseX, mouseY,random(10, 180), random(10, 40), random(10, 40)));
}

function draw() {

    background(background_image);

    Engine.update(engine);
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].show();
    }
    noStroke(255);
    fill(colors.green_darken_3);
    rectMode(CENTER);
    rect(ground.position.x, ground.position.y, width, 10);

    socket.on('detection', function (msg) {

        //var drawStart = Date.now()
        detection_json = msg['detection']
        intentions = msg['intentions']
        
        /*drawField(ctx, canvas.width, canvas.height);
        intentions = Object.keys(intentions).map(function (key) {
            return intentions[key];
        });*/
        
    
        // start ball drawing
        // end ball drawing
        // start player drawing
        /*detection_json.robots_blue.forEach(function (robot) {
            player_pos = translatePosition(robot.x, robot.y)
            tag = robot.robot_id
            angle = robot.orientation
            confidence = robot.confidence
            drawPlayer(ctx, player_pos.x, player_pos.y, -angle, 'blue', tag, confidence)
        });
    
        detection_json.robots_yellow.forEach(function (robot) {
            player_pos = translatePosition(robot.x, robot.y)
            tag = robot.robot_id
            angle = robot.orientation
            confidence = robot.confidence
    
            let color = '';
            if (matchSide) {
                color = colors.blue;
            } else {
                color = colors.yellow;
            }
            drawPlayer(ctx, player_pos.x, player_pos.y, -angle, color, tag, confidence)
        });
    
        // end player drawing
        //console.log(Date.now()-drawStart)
        if (detection_json.balls.length >= 1) {
            ball_pos = [
                detection_json.balls[0].x,
                detection_json.balls[0].y
            ]
            ball_pos = translatePosition(ball_pos[0], ball_pos[1])
            drawBall(ctx, ball_pos.x, ball_pos.y, 12, 'orange')
        }*/
    
    });

    
    //rect(ground.position.x, ground.position.y, 100, 20);
}

let n_box = function(x, y, w, h, angle) {

    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;

    var options = {
        friction: 0.3,
        restitution: 0
    }

    World.add(world, this.body);

    this.show = function() {

        let pos   = this.body.position;
        let angle = this.body.angle;

        push();
            translate(pos.x, pos.y);
            rectMode(CENTER);
            rotate(angle);
            strokeWeight(1);
            stroke(255);
            fill(127);
            rect(0, 0, this.w, this.h);
        pop();
    }

}

function renderConsole() {

    //TODO: Add a JSON file with all the console configuration and load it, rather than hard code the propertys.

    let welcomeString    = "NoPlan Console [Version 1.0.1]\n2018 Project Neon. Aberto pra todo mundo.\n\n";
    let promptLabel      = "   ";
    let continueLabel    = "   ";
    let disableAutoFocus = false;

    let jqconsole = $('#console').jqconsole(welcomeString, promptLabel, continueLabel, disableAutoFocus);

    console.log = function(message) {
        jqconsole.Write(message + "\n", 'jqconsole-output');
    }

    /* Console Commands */
    
    let console_commands = {
        
        clear : function() {

            jqconsole.ClearText();
        },

        help : function() {

            jqconsole.Write("No help for you, otário \n", 'jqconsole-output');
        }

    };

    /*End console Commands */

    function handler(input) {

        try {

            let tmp = input.split("(");

            if (console_commands.hasOwnProperty(tmp[0])) {
                console_commands[tmp[0]]();
            } else {
                eval(input);
            }
            startPrompt();

        } catch(e) {

            jqconsole.Write(e + '\n', 'jqconsole-output');
            startPrompt();

        }

    };

    let startPrompt = function () {
        jqconsole.Prompt(true, handler);
    };
    startPrompt();

};

 function drawField(ctx, w, h) {

    let field = new Image();
        field.src = "/img/field.png";

    ctx.drawImage(field, 0, 0, w, h);

     // Render field
    /* ctx.fillStyle = "#333";
     ctx.fillRect(0, 0, width, height);

     // Draw Field center lines and circle
     ctx.beginPath();
     ctx.fillStyle = "#FFF";
     ctx.arc(xCenter, yCenter, 1, 0, Math.PI * 2, false);
     ctx.fill();
     var widthP = w;
     var heightP = h;

     var widthCm = 170;
     var heightCm = 130;

     var ratioPxCm = widthP / widthCm;

     var xCenter = widthP / 2;
     var yCenter = heightP / 2;

     var goalH = 40 * ratioPxCm;


     ctx.beginPath();
     ctx.strokeStyle = "white";
     ctx.lineWidth = 0.5 * ratioPxCm;
     ctx.rect(xCenter - (75 * ratioPxCm), 0, 150 * ratioPxCm, 130 * ratioPxCm);
     ctx.stroke();

     ctx.beginPath();
     ctx.arc(xCenter, yCenter, (20 * ratioPxCm), 0, 2 * Math.PI);
     ctx.stroke();


     //Left Goal Area
     ctx.beginPath();
     ctx.strokeStyle = "white";
     ctx.lineWidth = 0.5 * ratioPxCm;
     ctx.fillStyle = '#444'
     ctx.fillRect(0, yCenter - (20 * ratioPxCm), 10.3 * ratioPxCm, 40 * ratioPxCm);
     ctx.stroke();

     //Right Goal Area
     ctx.beginPath();
     ctx.strokeStyle = "white";
     ctx.lineWidth = 0.5 * ratioPxCm;
     ctx.fillStyle = '#444'
     ctx.fillRect(widthP - (10.3 * ratioPxCm), yCenter - (20 * ratioPxCm), 10 * ratioPxCm, 40 * ratioPxCm);
     ctx.stroke();

     //Draw Left Goal Lines
     ctx.beginPath();
     ctx.strokeStyle = "white";
     ctx.lineWidth = 0.5 * ratioPxCm;
     ctx.fillStyle = '#333'
     ctx.moveTo(xCenter + (170 * ratioPxCm), yCenter + (20 * ratioPxCm));
     ctx.lineTo(xCenter + (170 * ratioPxCm) - (10 * ratioPxCm), yCenter + (20 * ratioPxCm));
     ctx.lineTo(xCenter + (170 * ratioPxCm) - (10 * ratioPxCm), yCenter + (20 * ratioPxCm));
     ctx.lineTo(xCenter + (170 * ratioPxCm), (yCenter + (35 * ratioPxCm)) - (70 * ratioPxCm));

     // Draw Central Line'
     ctx.moveTo(xCenter, 0);
     ctx.lineTo(xCenter, heightP);

     //Draw Right side goal area
     ctx.moveTo(xCenter + (75 * ratioPxCm), yCenter + (35 * ratioPxCm));
     ctx.lineTo(xCenter + (60 * ratioPxCm), yCenter + (35 * ratioPxCm));
     ctx.lineTo(xCenter + (60 * ratioPxCm), (yCenter + (35 * ratioPxCm)) - (70 * ratioPxCm));
     ctx.lineTo(xCenter + (75 * ratioPxCm), (yCenter + (35 * ratioPxCm)) - (70 * ratioPxCm));

     //Draw Left side goal area
     ctx.moveTo(xCenter - (75 * ratioPxCm), yCenter + (35 * ratioPxCm));
     ctx.lineTo(xCenter - (60 * ratioPxCm), yCenter + (35 * ratioPxCm));
     ctx.lineTo(xCenter - (60 * ratioPxCm), (yCenter + (35 * ratioPxCm)) - (70 * ratioPxCm));
     ctx.lineTo(xCenter - (75 * ratioPxCm), (yCenter + (35 * ratioPxCm)) - (70 * ratioPxCm));


     //Draw bottom-left +
     ctx.moveTo(xCenter - (37.5 * ratioPxCm), (yCenter) + (44 * ratioPxCm));
     ctx.lineTo(xCenter - (37.5 * ratioPxCm), (yCenter) + (36 * ratioPxCm));
     ctx.moveTo(xCenter - (41.5 * ratioPxCm), (yCenter) + (40 * ratioPxCm));
     ctx.lineTo(xCenter - (33.5 * ratioPxCm), (yCenter) + (40 * ratioPxCm));
     //Draw center-left +
     ctx.moveTo((xCenter) - 37.5 * ratioPxCm, (yCenter) - (4 * ratioPxCm));
     ctx.lineTo((xCenter) - 37.5 * ratioPxCm, (yCenter) + (4 * ratioPxCm));
     ctx.moveTo((xCenter) - 41.5 * ratioPxCm, yCenter);
     ctx.lineTo((xCenter) - 33.5 * ratioPxCm, yCenter);
     //Draw top-left +
     ctx.moveTo((xCenter) - 37.5 * ratioPxCm, (yCenter) - (44 * ratioPxCm));
     ctx.lineTo((xCenter) - 37.5 * ratioPxCm, (yCenter) - (36 * ratioPxCm));
     ctx.moveTo((xCenter) - 41.5 * ratioPxCm, (yCenter) - (40 * ratioPxCm));
     ctx.lineTo((xCenter) - 33.5 * ratioPxCm, (yCenter) - (40 * ratioPxCm));


     //Draw bottom-right +
     ctx.moveTo(xCenter + (37.5 * ratioPxCm), (yCenter) + (44 * ratioPxCm));
     ctx.lineTo(xCenter + (37.5 * ratioPxCm), (yCenter) + (36 * ratioPxCm));
     ctx.moveTo(xCenter + (41.5 * ratioPxCm), (yCenter) + (40 * ratioPxCm));
     ctx.lineTo(xCenter + (33.5 * ratioPxCm), (yCenter) + (40 * ratioPxCm));
     //Draw center-right +
     ctx.moveTo((xCenter) + 37.5 * ratioPxCm, (yCenter) - (4 * ratioPxCm));
     ctx.lineTo((xCenter) + 37.5 * ratioPxCm, (yCenter) + (4 * ratioPxCm));
     ctx.moveTo((xCenter) + 41.5 * ratioPxCm, yCenter);
     ctx.lineTo((xCenter) + 33.5 * ratioPxCm, yCenter);
     //Draw top-right +
     ctx.moveTo((xCenter) + 37.5 * ratioPxCm, (yCenter) - (44 * ratioPxCm));
     ctx.lineTo((xCenter) + 37.5 * ratioPxCm, (yCenter) - (36 * ratioPxCm));
     ctx.moveTo((xCenter) + 41.5 * ratioPxCm, (yCenter) - (40 * ratioPxCm));
     ctx.lineTo((xCenter) + 33.5 * ratioPxCm, (yCenter) - (40 * ratioPxCm));

     ctx.strokeStyle = "white";
     ctx.lineWidth = 0.5 * ratioPxCm;
     ctx.stroke();*/
 }

 function translatePosition(pos_x, pos_y) {
     x = pos_x * scale + width / 2
     y = pos_y * scale + height / 2
     return {
         'x': x,
         'y': height - y
     }
 }

 function drawBall(ctx, pos_x, pos_y, radius, color) {
     ctx.beginPath();
     ctx.fillStyle = color;
     ctx.strokeStyle = 'orange';
     ctx.arc(pos_x, pos_y, radius, 0, 2 * Math.PI);
     ctx.fill();
     ctx.stroke();
 }

 function drawSemiCircle(ctx, pos_x, pos_y, init_angle, end_angle, radius, color) {
     ctx.beginPath();
     ctx.strokeStyle = color;
     ctx.arc(pos_x, pos_y, 30, init_angle, end_angle);
     ctx.stroke();
 }

 function drawPlayer(ctx, pos_x, pos_y, angle, color, number_tag, confidence) {
     ctx.beginPath();
     ctx.fillStyle = 'gray';
     ctx.fillRect(pos_x - 40, pos_y - 50, 80, 15)
     ctx.fillStyle = color
     ctx.fillRect(pos_x - 40, pos_y - 50, 80 * confidence, 15)
     ctx.lineWidth = 7;
     ctx.strokeStyle = 'black';
     ctx.stroke();
     drawSemiCircle(ctx, pos_x, pos_y, angle + 0.75, angle - 0.75, 'red')
     ctx.fill();
     ctx.font = "30px Verdana";
     ctx.fillStyle = 'black';
     ctx.fillText(number_tag, pos_x - 9, pos_y + 10);
 }