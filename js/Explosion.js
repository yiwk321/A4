class Explosion {
    constructor(x, y) {
        this.body = document.getElementById("explosion");
        this.x = x;
        this.y = y;
        this.count = 0;
    }

    draw(context) {
        if (this.count == 0) {
            var sound = new Audio("../audio/explosion.wav");
            sound.volume = 0.3;
            sound.play();
        }
        context.drawImage(this.body, this.x - this.body.naturalWidth / 6, this.y - this.body.naturalHeight / 6, this.body.naturalWidth / 3, this.body.naturalHeight / 3);
        this.count++;
    }

    getCount() {
        return this.count;
    }
}