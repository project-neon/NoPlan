let map = {};
function mapKeyEvents(e) {
    window.removeEventListener('scroll', noscroll);
    e = e || window.event;
    map[e.keyCode] = (e.type == 'keydown');
    checkKey();
}

function checkKey() {

    if (map[38] && map[37]) {
        socket.emit('simulation', {key: 'up', key1: 'left'})
        window.addEventListener('scroll', noscroll);
    }
    else if (map[38] && map[39]) {
        socket.emit('simulation', {key: 'up', key1: 'right'})
        window.addEventListener('scroll', noscroll);
    }
    else if (map[40] && map[37]) {
        socket.emit('simulation', {key: 'down', key1: 'left'})
        window.addEventListener('scroll', noscroll);
    }
    else if (map[40] && map[39]) {
        socket.emit('simulation', {key: 'down', key1: 'right'})
        window.addEventListener('scroll', noscroll);
    }
    else if (map[38]) {
        socket.emit('simulation', {key: 'up', key1: ''});
        window.addEventListener('scroll', noscroll);
    }
    else if (map[40]) {
        socket.emit('simulation', {key: 'down', key1: ''});
        window.addEventListener('scroll', noscroll);
    }
    else if (map[37]) {
       socket.emit('simulation', {key: 'left', key1: ''});
       window.addEventListener('scroll', noscroll);
    }
    else if (map[39]) {
       socket.emit('simulation', {key: 'right', key1: ''});
       window.addEventListener('scroll', noscroll);
    }
    else if (map[32]) {
       socket.emit('simulation', {key: 'stop'});
       window.addEventListener('scroll', noscroll);
    }

}