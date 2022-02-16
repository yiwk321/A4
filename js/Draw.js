window.onload = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var fps = 0;
    var framesThisSecond = 0;
    setInterval(function() {
        fps = framesThisSecond;
        framesThisSecond = 0;
    }, 1000);

    var helicopters = new Array();
    var missiles = new Array();
    var explosions = new Array();
    const num_helicopters = 5;
    var player = new Player(canvas.width / 2, canvas.height / 2, 0, 0);
    helicopters.push(player);
    createHelicopters(num_helicopters);

    var previous = new Date().getTime();
    var lag = 0;
    var targetFrameTime = 1000 / 60;

    helicopters.push(new DeterministicHelicopter(0, 0, 1.3, 1.2));
    var frame = 0;

    requestAnimationFrame(mainLoop);

    function mainLoop() {
        var current = new Date().getTime();
        var elapsed = current - previous;
        previous = current;
        lag += elapsed;

        processInput();

        while (lag >= targetFrameTime) {
            update();
            lag -= targetFrameTime;
        }

        draw(lag / targetFrameTime);

        requestAnimationFrame(mainLoop);
    }

    function processInput() {
        player.processInput(missiles);
    }

    function update() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        for (var i = 0; i < helicopters.length; i++) {
            helicopters[i].update();

            if (frame < 100 && helicopters[i] instanceof DeterministicHelicopter && !(helicopters[i] instanceof Player)) {
                console.log(helicopters[i].x);
                console.log(helicopters[i].y);
            }

            var missile = helicopters[i].maybeShoot();
            if (missile != null) {
                missiles.push(missile);
            }
        }
        for (var i = 0; i < missiles.length; i++) {
            missiles[i].update();
        }
        checkCollision();
    }

    function draw(lag) {
        if (frame < 100) console.log(frame);
        frame++;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillText("FPS: " + fps, 10, 10);
        ++framesThisSecond;
        var arr = Array.from(helicopters);
        for (var i = 0; i < arr.length; i++) {
            arr[i].draw(context, lag);
        }
        arr = Array.from(missiles);
        for (var i = 0; i < arr.length; i++) {
            arr[i].draw(context, lag);
        }
        for (var i = 0; i < explosions.length; i++) {
            explosions[i].draw(context, lag);
            if (explosions[i].getCount() > 20) {
                explosions.splice(i, 1);
            }
        }
    }

    function checkCollision() {
        for (var i = 0; i < missiles.length; i++) {
            if (missiles[i].safe) continue;
            for (var j = i + 1; j < missiles.length; j++) {
                if (missiles[j].safe) continue;
                if (missiles[i].collideWith(missiles[j])) {
                    explosions.push(new Explosion(missiles[i].x, missiles[i].y));
                    missiles.splice(j, 1);
                    missiles.splice(i, 1);
                    i--;
                    break;
                }
            }
        }

        for (var j = 0; j < helicopters.length; j++) {
            for (var i = 0; i < missiles.length; i++) {
                if (missiles[i].safe) continue;
                if (helicopters[j].collideWith(missiles[i])) {
                    explosions.push(new Explosion(missiles[i].x, missiles[i].y));
                    var owner = missiles[i].getOwner();
                    if (owner == helicopters[j]) {
                        owner.changeScore(-1);
                    } else {
                        owner.changeScore(1);
                    }
                    helicopters[j].die();
                    missiles.splice(i, 1);
                    j--;
                    break;
                }
            }
        }
    }

    function createHelicopters(num_helicopters) {
        for (var i = 0; i < num_helicopters; i++) {
            createHelicopter();
        }
    }

    function createHelicopter() {
        var x = Math.random() * 0.7 * canvas.width;
        var y = Math.random() * 0.7 * canvas.height;
        var velocity_x = (Math.random() - 0.5) * 6;
        var velocity_y = (Math.random() - 0.5) * 6;
        helicopters.push(new Helicopter(x, y, velocity_x, velocity_y));
    }
};