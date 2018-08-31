(function () {

    function init() {
        //main
        socket.on('detection', function (msg) {

            //var drawStart = Date.now()
            detection_json = msg['detection']
            intentions = msg['intentions']

            drawField(ctx, canvas.width, canvas.height);
            intentions = Object.keys(intentions).map(function (key) {
                return intentions[key];
            });
            drawIntentions(ctx, intentions)

            // start ball drawing
            // end ball drawing
            // start player drawing
            detection_json.robots_blue.forEach(function (robot) {
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
            }

        });
        renderConsole();
    }

    init();

    M.AutoInit();

    /*let btn_match = document.getElementById("match");
        btn_match.addEventListener('click', changeState);

    let btn_side = document.getElementById("side");
        btn_side.addEventListener('click', changeSide);*/

    //document.addEventListner("onkeydown", mapKeyEvents);
    //document.addEventListner("onkeyup", mapKeyEvents);

})();