class Helicopter extends Rotatable {
    constructor(x, y, velocity_x, velocity_y) {
        super(x, y, velocity_x, velocity_y);
        this.body = document.getElementById("heli");
        this.rotor = document.getElementById("rotor");
        this.rotor_offset_x = 40;
        this.rotor_offset_y = 0;
        this.rotor_angle = 0;
        this.rotation_speed = 0.03 * Math.PI;
        this.cooldown = 60;
        this.score = 0;
        this.death = 0;
        this.respawn_time = 180;
        this.respawn_timer = this.respawn_time;
        this.dead = false;
        this.invulnerable = 60;
        this.cooldown_offset_x = 200;
        this.cooldown_offset_y = 90;
        this.cooldown_radius = 15;
        this.cooldown_time = 180;
    }

    draw(context, lag) {
        if (this.dead) return;

        context.save();
        context.translate(this.x + lag * this.velocity_x, this.y + lag * this.velocity_y);
        context.beginPath();

        context.font = "15px Arial";
        context.fillText("S: " + this.score + " D: " + this.death, -10, -10)

        // context.save();
        // context.translate(this.cooldown_offset_x, this.cooldown_offset_y);
        // context.arc(0, 0, this.cooldown_radius, (this.cooldown_time - this.cooldown) * 2 * Math.PI / this.cooldown_time - Math.PI / 2, 2 * Math.PI - Math.PI / 2, false);
        // context.arc(0, 0, this.cooldown_radius - 7, 2 * Math.PI - Math.PI / 2, (this.cooldown_time - this.cooldown) * 2 * Math.PI / this.cooldown_time - Math.PI / 2, true);
        // context.fill();
        // context.restore();
        this.drawArc(context, this.cooldown_offset_x, this.cooldown_offset_y, this.cooldown_radius, this.cooldown_radius - 7, this.cooldown, this.cooldown_time, -5, 5, 15);

        this.drawRotatedImage(context, this.body, this.rotate_angle);

        context.translate(-this.rotor.naturalWidth / 2, -this.rotor.naturalHeight / 2);
        context.translate(this.rotor_offset_x, this.rotor_offset_y);
        this.drawRotatedImage(context, this.rotor, this.rotor_angle + this.rotation_speed * lag);

        context.closePath();
        context.restore();
    }

    update() {
        if (this.dead) {
            this.respawn_timer--;
            if (this.respawn_timer == 0) this.respawn();
            return;
        }
        super.update();
        this.randomMotion();
        this.rotor_angle += this.rotation_speed;
        if (this.cooldown > 0) this.cooldown--;
        if (this.invulnerable > 0) this.invulnerable--;
    }

    randomMotion() {
        if (this.cooldown % 10 == 0) {
            var random_x = (Math.random() - 0.5) * 0.5;
            var random_y = (Math.random() - 0.5) * 0.5;
            if (random_x * this.velocity_x < 0 && Math.abs(this.velocity_x + random_x) > 1) this.velocity_x += random_x;
            if (random_y * this.velocity_y < 0 && Math.abs(this.velocity_y + random_y) > 1) this.velocity_y += random_y;
            if (this.cooldown % 30 == 0) {
                this.updateRotateAngle();
            }
        }
    }

    respawn() {
        this.dead = false;
        this.x = Math.random() * 0.7 * this.canvas.width;
        this.y = Math.random() * 0.7 * this.canvas.height;
        this.velocity_x = (Math.random() - 0.5) * 6;
        this.velocity_y = (Math.random() - 0.5) * 6;
        var velocity = Math.sqrt(this.velocity_x * this.velocity_x + this.velocity_y * this.velocity_y);
        if (velocity < 2) {
            this.velocity_x *= 2 / velocity;
            this.velocity_y *= 2 / velocity;
        }
        this.cooldown = 60;
        this.respawn_timer = this.respawn_time;
        this.invulnerable = 60;
        this.updateRotateAngle();
    }

    maybeShoot() {
        if (this instanceof Player) return;
        if (this.cooldown <= 0) {
            this.cooldown = this.cooldown_time;
            return new Missile(this.x + this.body.naturalWidth / 2, this.y + this.body.naturalHeight / 2,
                Math.max(this.velocity_x * 2, 10) + Math.random(), Math.max(this.velocity_y * 2, 10) + Math.random(),
                this, this.canvas.width, this.canvas.height);
        }
        return null;
    }

    changeScore(score) { this.score += score; }

    die() {
        this.dead = true;
        this.death++;
    }

    drawArc(context, x, y, r1, r2, timer, time, text_x, text_y, font_size) {
        context.save();
        context.translate(x, y);
        context.arc(0, 0, r1, (time - timer) * 2 * Math.PI / time - Math.PI / 2, 2 * Math.PI - Math.PI / 2, false);
        context.arc(0, 0, r2, 2 * Math.PI - Math.PI / 2, (time - timer) * 2 * Math.PI / time - Math.PI / 2, true);
        context.fill();
        var t = Math.ceil(timer / 60);
        context.font = font_size + "px Arial";
        if (t > 0) context.fillText(t, text_x, text_y);
        context.restore();
    }
}