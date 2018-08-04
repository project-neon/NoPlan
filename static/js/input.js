let map = {};
function mapKeyEvents(e) {
    e = e || window.event;
    map[e.keyCode] = (e.type == 'keydown');
    checkKey();
}

function checkKey() {

    if (map[38] && map[37]) {
        socket.emit('simulation', {key: 'up', key1: 'left'})
        console.log("up and left")
    }
    else if (map[38] && map[39]) {
        socket.emit('simulation', {key: 'up', key1: 'right'})
        console.log("up and right")
    }
    else if (map[40] && map[37]) {
        socket.emit('simulation', {key: 'down', key1: 'left'})
        console.log("down and left")
    }
    else if (map[40] && map[39]) {
        socket.emit('simulation', {key: 'down', key1: 'right'})
        console.log("down and right")
    }
    else if (map[38]) {
        socket.emit('simulation', {key: 'up', key1: ''})
    }
    else if (map[40]) {
        socket.emit('simulation', {key: 'down', key1: ''})
    }
    else if (map[37]) {
       socket.emit('simulation', {key: 'left', key1: ''})
    }
    else if (map[39]) {
       socket.emit('simulation', {key: 'right', key1: ''})
    }
    else if (map[32]) {
       socket.emit('simulation', {key: 'stop'})
    }

}