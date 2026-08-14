class Player {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.radius = 20;
        this.speed = 4;
        this.color = "#00D9FF";


        // =====================
        // VIDA
        // =====================

        this.maxHealth = 100;
        this.health = 100;

        this.invincibleTimer = 0;


        // =====================
        // TIROS
        // =====================

        this.bulletDamage = 1;

        this.bulletSpeed = 7;

        this.bulletSize = 5;
    }


    update(keys, canvas) {

        let dx = 0;
        let dy = 0;


        if (keys["w"]) dy--;
        if (keys["s"]) dy++;

        if (keys["a"]) dx--;
        if (keys["d"]) dx++;


        if (dx !== 0 || dy !== 0) {

            const tamanho =
                Math.hypot(dx, dy);

            dx /= tamanho;
            dy /= tamanho;

        }


        this.x +=
            dx * this.speed;

        this.y +=
            dy * this.speed;


        this.x =
            Math.max(
                this.radius,
                Math.min(
                    canvas.width - this.radius,
                    this.x
                )
            );


        this.y =
            Math.max(
                this.radius,
                Math.min(
                    canvas.height - this.radius,
                    this.y
                )
            );


        if (this.invincibleTimer > 0) {

            this.invincibleTimer--;

        }

    }


    takeDamage(amount) {

        if (this.invincibleTimer > 0) {

            return;

        }


        this.health -= amount;


        if (this.health < 0) {

            this.health = 0;

        }


        this.invincibleTimer = 60;

    }


    draw(ctx) {

        ctx.fillStyle =
            this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}