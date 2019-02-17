 (function () {

    function init() {
        //main
        Console();

        M.AutoInit();

        document.onkeyup   = mapKeyEvents;
        document.onkeydown = mapKeyEvents;

        let btn_simulated_match = document.getElementById("btn_simulated_match");
            btn_simulated_match.addEventListener('click', function() {
                changeState();

                let selects = document.querySelectorAll("select");
                selects.forEach(element => {
                    console.log(element.selectedIndex.valueOf());
                });
            });

        let btn_real_match = document.getElementById("btn_real_match");
            btn_real_match.addEventListener('click', function() {
            });


        let btn_change_side = document.getElementById('slt_change_side')
            btn_change_side.addEventListener("change", function (event) {
              socket.emit('state', {type: 'side', state: $(event.target).val()})
            });

        let btn_change_color = document.getElementById('slt_change_color')
            btn_change_color.addEventListener("change", function (event) {
              socket.emit('state', {type: 'color', state: $(event.target).val()})
            });

    }
    init();

 })();
