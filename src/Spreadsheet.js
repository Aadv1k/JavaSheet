export default class Spreadsheet {
    constructor(config) {
        this.cellWidth = config.cellWidth || 60;
        this.cellHeight = config.cellHeight || 15;

        this.height = config.height;
        this.width = config.width + this.cellWidth / 2;

        this.onDrag = config.onDrag || (() => {});
        this.onCellClick = config.onCellClick || (() => {});
        this.onRowClick = config.onRowClick || (() => {});
        this.onColClick = config.onColClick || (() => {});

        this.maxCellX = 100;
        this.maxCellY = 100;

        this.state = new Map();
    }

    drawSheet(context) {
        context.strokeStyle = "#AAAAAA";
        context.lineWidth = 1;
        context.imageSmoothingEnabled = false;

        for (let i = 0; i < this.maxCellY; i++) {
            for (let j = 0; j < this.maxCellX; j++) {
                this.#renderCell(context, j, i);
            }
        }
    }

    #renderCell(context, x, y) {
        const xx = x * this.cellWidth + 0.5;
        const yy = y * this.cellHeight + 0.5;
        const right = xx + this.cellWidth;
        const bottom = yy + this.cellHeight;

        context.beginPath();
        context.moveTo(xx, yy);
        context.lineTo(right, yy);
        context.lineTo(right, bottom);
        context.lineTo(xx, bottom);
        context.closePath();
        context.stroke();
    }


    render(canvas) {
        canvas.width = this.maxCellX * this.cellWidth;
        canvas.height = this.maxCellY * this.cellHeight;


        const context = canvas.getContext("2d");
        this.drawSheet(context);
    }
}
