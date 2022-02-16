class Rotatable {
    constructor(x, y, velocity_x, velocity_y) {
        this.x = x;
        this.y = y;
        this.velocity_x = velocity_x;
        this.velocity_y = velocity_y;
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.isPlayer = false;
        this.updateRotateAngle();
    }

    update() {
        if (this.x > this.canvas.width - this.body.naturalWidth || this.x < 0) {
            if (this.x > this.canvas.width - this.body.naturalWidth) this.x = this.canvas.width - this.body.naturalWidth;
            else this.x = 0;
            if (!(this instanceof Player)) {
                this.velocity_x = -this.velocity_x;
                this.updateRotateAngle();
            }
        }
        if (this.y > this.canvas.height - this.body.naturalHeight || this.y < 0) {
            if (this.y > this.canvas.height - this.body.naturalHeight) this.y = this.canvas.height - this.body.naturalHeight;
            else this.y = 0;
            if (!(this instanceof Player)) {
                this.velocity_y = -this.velocity_y;
                this.updateRotateAngle();
            }
        }
        // if (this instanceof Player) return;
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    }

    updateRotateAngle() {
        this.rotate_angle = Math.atan(this.velocity_y / this.velocity_x);
        if (this.velocity_x < 0) {
            this.rotate_angle += Math.PI;
        }
    }

    drawRotatedImage(context, image, angle) {
        var width = image.naturalWidth;
        var height = image.naturalHeight;
        context.translate(width / 2, height / 2);
        context.rotate(angle);
        context.translate(-width / 2, -height / 2);
        context.drawImage(image, 0, 0, width, height);
        context.translate(width / 2, height / 2);
    }

    hitbox() {
        var hitbox = new Array();
        hitbox.push(new Array(this.x + this.body.naturalWidth / 4, this.x + this.body.naturalWidth * 3 / 4));
        hitbox.push(new Array(this.y + this.body.naturalHeight / 4, this.y + this.body.naturalHeight * 3 / 4));
        return hitbox;
    }

    collideWith(other) {
        if (this instanceof Helicopter && this.invulnerable > 0) {
            return;
        }
        var hitbox = this.hitbox();
        var other_hitbox = other.hitbox();
        if (hitbox[0][1] < other_hitbox[0][0] || hitbox[0][0] > other_hitbox[0][1] || hitbox[1][1] < other_hitbox[1][0] || hitbox[1][0] > other_hitbox[1][1]) {
            return false;
        }
        return true;
    }

    processInput() {}
}