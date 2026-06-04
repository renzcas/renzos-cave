// TensorFold Organ — 3D rotating cube organ
export class TensorFold {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "tensorfold-canvas";
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "50%";
        this.canvas.style.left = "50%";
        this.canvas.style.transform = "translate(-50%, -50%)";
        this.canvas.style.pointerEvents = "none";
        this.canvas.width = 300;
        this.canvas.height = 300;

        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");
        this.angle = 0;
    }

    update() {
        const ctx = this.ctx;
        const size = 80;
        const a = this.angle;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(150, 150);
        ctx.rotate(a);

        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 3;

        ctx.strokeRect(-size, -size, size * 2, size * 2);

        ctx.restore();

        this.angle += 0.01;
    }
}
