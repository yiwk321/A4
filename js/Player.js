var keysdown = [];

window.addEventListener('keydown', function(e) {
    if (e.defaultPrevented) {
        return;
    }
    keysdown[e.key.toUpperCase()] = true;
    e.preventDefault();
}, true);


window.addEventListener('keyup', function(e) {
    if (e.defaultPrevented) {
        return;
    }
    keysdown[e.key.toUpperCase()] = false;
    e.preventDefault();
}, true);

class Player extends DeterministicHelicopter {
    constructor(x, y, velocity_x, velocity_y) {
        super(x, y, velocity_x, velocity_y);
        this.acc = 0.02;
        this.max_speed = 8;
        this.speed = 3;
        this.body = document.getElementById('player');
        this.rotor = document.getElementById('player_rotor');
    }

    randomMotion() {}

    processInput(missiles) {
        this.velocity_y = 0;
        this.velocity_x = 0.00000000001;
        var keyPressed = false;
        if (keysdown['W'] && !keysdown['S']) {
            this.velocity_y = -this.speed;
            keyPressed = true;
        }
        if (keysdown['A'] && !keysdown['D']) {
            this.velocity_x = -this.speed;
            keyPressed = true;
        }
        if (keysdown['D'] && !keysdown['A']) {
            this.velocity_x = this.speed;
            keyPressed = true;
        }
        if (keysdown['S'] && !keysdown['W']) {
            this.velocity_y = this.speed;
            keyPressed = true;
        }
        if (keysdown['SHIFT']) {
            if (this.speed < this.max_speed - this.acc) this.speed += this.acc;
        }
        if (keysdown['ALT']) {
            if (this.speed > this.acc) this.speed -= this.acc;
        }
        if (keysdown[' ']) {
            var missile = this.shoot();
            if (missile == null) return;
            missiles.push(missile);
        }

        if (keyPressed) {
            super.updateRotateAngle();
        }
    }

    shoot() {
        if (this.cooldown <= 0) {
            this.cooldown = this.cooldown_time;
            return new Missile(this.x + this.body.naturalWidth / 2, this.y + this.body.naturalHeight / 2,
                this.velocity_x * 2 + Math.random(), this.velocity_y * 2 + Math.random(),
                this, this.canvas.width, this.canvas.height);
        }
        return null;
    }

    draw(context, lag) {
        if (this.dead) {
            context.font = "50px Arial";
            context.fillText('Respawning in ', this.canvas.width / 2 - 155, this.canvas.height / 2 - 80);
            this.drawArc(context, this.canvas.width / 2, this.canvas.height / 2,
                this.canvas.height / 4, this.canvas.height / 5,
                this.respawn_timer, this.respawn_time, -60, 150, 230, 60);
            return;
        }
        super.draw(context, lag);
    }

}