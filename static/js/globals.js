let socket      = io.connect('http://localhost:8080');
let matchState  = false;
let matchSide   = false;

let colors = {

    grey_darken_1: "#757575",
    grey_darken_2: "#616161",
    grey_darken_3: "#424242",
    grey_darken_4: "#212121",

    green_darken_1: "#43a047",
    green_darken_2: "#388e3c",
    green_darken_3: "#2e7d32",
    green_darken_4: "#1b5e20",

    orange_darken_1: "#fb8c00",
    orange_darken_2: "#f57c00",
    orange_darken_3: "#ef6c00",
    orange_darken_4: "#e65100",

    yellow : "#ffeb3b",
    blue   : "#2196f3",
    red    : "#f44336",
    green  : "#4caf50",
    white  : "#ffffff",
    orange : "#ff9800"
};

let SimulatedMatch = {
    status : "",
    time   : "",
    score  : new Object(),
    sides  : new Object(),
    yellowTeam : new Object(),
    blueTeam   : new Object(),
    balls      : new Object()
};

function changeState() {

    matchState  = 1;
    socket.emit('state', {
        state: "toggle"
    })

    matchState = !matchState
}

function changeSide() {

    matchSide ? document.getElementById('side').style.backgroundColor = colors.blue : document.getElementById('side').style.backgroundColor = colors.yellow
    let our_side = 0;

    if (!our_side) {

        our_side = 1;
        socket.emit('state', {
            state: "side"
        })
        socket.emit('state', {
            state: "team"
        })
    }
    matchSide = !matchSide

}

function noscroll() {
    window.scrollTo( 0, 0 );
}