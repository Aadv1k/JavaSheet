export class Spreadsheet {
    constructor() {
        this.width = 500;
        this.height = 500;

        this.maxCellX = 100;
        this.maxCellY = 100;
    }

bind(elem) {
    elem.style.overflow = "scroll";
    elem.style.width = this.width + "px"; 
    elem.style.height = this.height + "px";

    let renderedCells = (new Array(this.maxCellX * this.maxCellY)).fill(false);
    const canvas = document.createElement("canvas");

    canvas.width = this.maxCellX * 60;
    canvas.height = this.maxCellY * 15;

    const context = canvas.getContext("2d");

    context.strokeStyle = "#AAAAAA";
    context.lineWidth = 1;
    context.imageSmoothingEnabled = false;

    const cellWidth = 60;
    const cellHeight = 15;
    for (let i = 0; i < this.maxCellY; i++) {
        for (let j = 0; j < this.maxCellX; j++) {
            const x = j * cellWidth + 0.5;
            const y = i * cellHeight + 0.5;
            const right = x + cellWidth;
            const bottom = y + cellHeight;

            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(right, y);
            context.lineTo(right, bottom);
            context.lineTo(x, bottom);
            context.closePath();
            context.stroke();
        }
    }

    elem.appendChild(canvas);
}



}
