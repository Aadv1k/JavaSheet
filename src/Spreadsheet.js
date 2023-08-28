export default class Spreadsheet {
    constructor(config) {
        this.cellWidth = config.cellWidth || 60;
        this.cellHeight = config.cellHeight || 15;

        this.height = config.height;
        this.width = config.width + this.cellWidth / 2;

        this.maxCellX = 100;
        this.maxCellY = 100;

        this.previouslySelectedCell = null;
    }

    drawSheet(context) {
        context.strokeStyle = "#AAAAAA";
        context.lineWidth = 1;
        context.imageSmoothingEnabled = false;
        context.font = "48px serif";

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

    #clamp(delta, gamma) {
        return Math.floor(delta / gamma) * gamma;
    }

    drawSelectionCell(context, x, y) {
        context.fillStyle = "#AAAAAA";
        context.fillRect(x + 0.5, y + 0.5, this.cellWidth, this.cellHeight);
    }

    drawSelectedCell(context, x, y) {
        context.fillStyle = "skyblue";
        context.fillRect(x + 0.5, y + 0.5, this.cellWidth, this.cellHeight);
    }

    drawSelectionBox(context, x, y, width, height) {
        context.strokeStyle = "#333333";
        context.strokeRect(x + 0.5, y + 0.5, width, height);
    }


    render(elem) {
        const canvas = document.createElement("canvas");

        elem.style.position = "relative";

        canvas.width = this.maxCellX * this.cellWidth;
        canvas.height = this.maxCellY * this.cellHeight;


        const context = canvas.getContext("2d");
        

        this.drawSheet(context);


        const selectionBox = document.createElement("div");
        selectionBox.classList.add("selection-box");
        selectionBox.style.border = "1px solid black";
        selectionBox.style.pointerEvents = "none";
        selectionBox.style.position = "absolute";
        elem.appendChild(selectionBox);

        let isDragging = false;
        let startX, startY, startColumn, startRow;

        canvas.addEventListener("mousedown", (event) => {
            startX = event.clientX;
            startY = event.clientY;

            const xx = this.#clamp(startX, this.cellWidth);
            const yy = this.#clamp(startY, this.cellHeight);


            this.drawSelectedCell(context, xx, yy);

            selectionBox.style.display = "block";

            startColumn = Math.floor(startX / this.cellWidth);
            startRow = Math.floor(startY / this.cellHeight);

            selectionBox.style.left = startX + "px";
            selectionBox.style.top = startY + "px";
            selectionBox.style.width = "0";
            selectionBox.style.height = "0";

            isDragging = true;
        });

        canvas.addEventListener("mousemove", (event) => {
            if (!isDragging) return;

            const currentX = event.clientX;
            const currentY = event.clientY;

            const column = Math.floor(currentX / this.cellWidth);
            const row = Math.floor(currentY / this.cellHeight);

            const minX = Math.min(startColumn, column);
            const minY = Math.min(startRow, row);
            const maxX = Math.max(startColumn, column);
            const maxY = Math.max(startRow, row);

            const x = minX * this.cellWidth;
            const y = minY * this.cellHeight;
            const width = (maxX - minX + 1) * this.cellWidth;
            const height = (maxY - minY + 1) * this.cellHeight;

            selectionBox.style.left = x + "px";
            selectionBox.style.top = y + "px";
            selectionBox.style.width = width + "px";
            selectionBox.style.height = height + "px";
        });

        

        elem.addEventListener("mouseup", () => {
            isDragging = false;
        });


        elem.appendChild(canvas);

    }
}
