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

                console.log("clicou em 'Simulated Match'");
            });

        let btn_real_match = document.getElementById("btn_real_match");
            btn_real_match.addEventListener('click', function() {
                console.log("clicou em 'Real Match'");
            });


    }
    init();

 })();