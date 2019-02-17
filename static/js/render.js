
const REAL_WORLD_FIELD_HEIGHT = 1300;
const REAL_WORLD_FIELD_WIDTH  = 1700;

const PLAYER_SIZE = 30;
const BALL_RADIUS = 8;


let isPhysicsActive = false; // Active Physics

//Canva's propertys
let canvas_width  = 750,
    scale         = canvas_width / REAL_WORLD_FIELD_WIDTH,
    canvas_height = scale * REAL_WORLD_FIELD_HEIGHT,
    xCenter       = canvas_width / 2,
    yCenter       = canvas_height / 2;

//Aliases for physics engine
let Engine = Matter.Engine,
    World  = Matter.World,
    Bodies = Matter.Bodies;

let engine,
    world,
    canvas,
    background_image;

let detection_json;

socket.on('detection', function (msg) {
    detection_json = msg['detection'];

    detection_json.robots_blue.forEach(function(dataset) {

        let position = translatePosition(dataset.x, dataset.y);

        if (SimulatedMatch.blueTeam.hasOwnProperty(dataset.robot_id)) {

            if (dataset.robot_id != SimulatedMatch.blueTeam[dataset.robot_id]._id) {
                SimulatedMatch.blueTeam[dataset.robot_id]._setId(id);
            }

            if (dataset.confidence != SimulatedMatch.blueTeam[dataset.robot_id]._confidence) {
                SimulatedMatch.blueTeam[dataset.robot_id]._setConfidence(dataset.confidence);
            }

            SimulatedMatch.blueTeam[dataset.robot_id]._update(position.x, position.y, -dataset.orientation);

        } else {
            let player = new Player(dataset.robot_id, colors.blue, PLAYER_SIZE, PLAYER_SIZE, position.x, position.y, -dataset.orientation);
                player._add();
        }

    });

    detection_json.robots_yellow.forEach(function(dataset) {

        let position = translatePosition(dataset.x, dataset.y);

        if (SimulatedMatch.yellowTeam.hasOwnProperty(dataset.robot_id)) {

            if (dataset.robot_id != SimulatedMatch.yellowTeam[dataset.robot_id]._id) {
                SimulatedMatch.yellowTeam[dataset.robot_id]._setId(id);
            }

            if (dataset.confidence != SimulatedMatch.yellowTeam[dataset.robot_id]._confidence) {
                SimulatedMatch.yellowTeam[dataset.robot_id]._setConfidence(dataset.confidence);
            }

            SimulatedMatch.yellowTeam[dataset.robot_id]._update(position.x, position.y, -dataset.orientation);

        } else {
            let player = new Player(dataset.robot_id, colors.yellow, 30, 30, position.x, position.y, -dataset.orientation);
                player._add();
        }

    });

    //Adding a ball, or updating it's position
    if (detection_json.balls.length > 0) {
      position = translatePosition(detection_json.balls[0].x, detection_json.balls[0].y);

      if (SimulatedMatch.balls.hasOwnProperty(1)) {

        SimulatedMatch.balls[1]._update(position.x, position.y);

      } else {

          let ball = new Ball(position.x, position.y, BALL_RADIUS, colors.orange);
          ball._add();

      }
    }

});

function setup() {

    canvas = createCanvas(canvas_width, canvas_height);
    canvas.parent("div_field_container");
    background_image = loadImage("/img/field.png");

    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);

}

function draw() {

    background(background_image);
    Engine.update(engine);

    Object.keys(SimulatedMatch.blueTeam).forEach(key => {
        SimulatedMatch.blueTeam[key]._show();
    });
    Object.keys(SimulatedMatch.yellowTeam).forEach(key => {
        SimulatedMatch.yellowTeam[key]._show();
    });
    Object.keys(SimulatedMatch.balls).forEach(key => {
        SimulatedMatch.balls[key]._show();
    });

}

let Player = function(id, team, w, h, x, y, angle) {

    this._id   = id;
    this._team = team;
    this._w = w;
    this._h = h;
    this._x = x;
    this._y = y;
    this._angle = angle;
    this._colorText = colors.white;

    this._isDragging = false;

    this._setRole = function(role) {
        this._role = role;
    }

    this._setConfidence = function(confidence) {
        this._confidence = confidence;
    }

    this._setName = function(name) {
        this._name = name;
    }

    this._setId = function(id) {
        this._id = id;
    }

    this._update = function(x, y, angle) {
        this._x = x;
        this._y = y;
        this._angle = angle;
    }

    this._show = function() {
        push();
            translate(this._x, this._y);
            rectMode(CENTER);
            rotate(this._angle);
            strokeWeight(1);
            stroke(colors.grey_darken_4);
            fill(this._team);
            rect(0, 0, this._w, this._h, 1, 5, 5, 1);
            fill("#ffffff");
            textSize(18);
            text(this._id, -7, 7);
        pop();
    };

    this._add = function() {
        if (this._team == colors.blue) {
            SimulatedMatch.blueTeam[this._id] = this;
        } else if (this._team == colors.yellow) {
            SimulatedMatch.yellowTeam[this._id] = this;
        } else {
            console.log("Robot team is undefined. Id: " + this._id);
        }
    }

};

let Ball = function(x, y, radius, color) {

    this._radius = radius;
    this._id     = 1;
    this._x      = x;
    this._y      = y;
    this._color  = color;

    this._changeColor = function(color) {
        this._color = color;
    }

    this._changeRadius = function(radius) {
        this._radius = radius;
    }

    this._update = function(x, y) {
        this._x = x;
        this._y = y;
        this._radius = radius;
    }

    this._show = function() {
        push();
            stroke(colors.grey_darken_4);
            fill(this._color);
            arc(this._x, this._y, this._radius * 2, this._radius * 2, 0, 4 * PI);
        pop();
    }

    this._add = function() {
        SimulatedMatch.balls[this._id] = this;
    }

}

let Console = function() {

    //TODO: Add a JSON file with all the console configuration and load it, rather than hard code the propertys.

    let welcomeString    = "NoPlan Console [Version 1.0.1]\n2018 Project Neon. Aberto pra todo mundo.\n\n";
    let promptLabel      = "   ";
    let continueLabel    = "   ";
    let disableAutoFocus = false;

    let jqconsole = $('#console').jqconsole(welcomeString, promptLabel, continueLabel, disableAutoFocus);

    let console_commands = {
        clear : function() {
            jqconsole.ClearText();
        },
        help : function() {
            jqconsole.Write("No help for you, otário \n", 'jqconsole-output');
        }
    };

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

function translatePosition(x, y) {
    x = x * scale + canvas_width / 2
    y = y * scale + canvas_height / 2
    return {
        'x': x,
        'y': canvas_height - y
    }
}
