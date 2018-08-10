var canvas      = document.getElementById("field_canvas");
var ctx         = canvas.getContext("2d");
var canvasH     = 1300;
var canvasW     = 1700;
var width       = canvas.width;
var scale       = width / canvasW;
var height      = scale * canvasH;
var xCenter     = width / 2;
var yCenter     = height / 2;

canvas.height = height;

function drawIntentions(ctx, intentions) {
     for (i in intentions) {
         intention = intentions[i]
         if (intention.constructor.name == 'Array') {
             drawIntentions(ctx, intention)
         } else {
             switch (intention.type) {
                 case 'LineIntention':
                     console.log('line intention: ' + intention.name)
                     break
                 case 'PointIntention':
                     console.log('point intention: ' + intention.name)
                     break
             }
         }
     }
 }

 function drawField(ctx, w, h) {

    let field = new Image();
        field.src = "/img/field.png";

    ctx.drawImage(field, 0, 0, w, h);

     // Render field
     /*ctx.fillStyle = "#333";
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