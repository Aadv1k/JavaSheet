export default class Spreadsheet {
    constructor(config) {
        this.cellWidth = config.cellWidth || 90;
        this.cellHeight = config.cellHeight || 20;

        this.height = config.height;
        this.width = config.width + this.cellWidth / 2;

        this.maxCellX = 100;
        this.maxCellY = 100;

        this.previouslySelectedCell = null;
        this.cellMap = new Map();

        this.cellMap.set("0,0", "S No");
        this.cellMap.set("1,0", "Name");
        this.cellMap.set("2,0", "Age");
        this.cellMap.set("3,0", "Profession");

        this.config = config;
    }

    drawSheet(context) {
        context.lineWidth = 1;
        context.imageSmoothingEnabled = false;

        for (let i = 0; i < this.maxCellY; i++) {
            for (let j = 0; j < this.maxCellX; j++) {
                const cellContent = this.cellMap.get(`${j},${i}`);
                if (cellContent != undefined) {
                    this.#renderCellWithContent(context, j, i, cellContent);
                    continue;
                }

                this.#renderCell(context, j, i);
            }
        }
    }


    #truncateText(text, maxInPx) {
        // Create an HTML element to measure text width
        const measureElement = document.createElement('span');
        measureElement.style.visibility = 'hidden';
        measureElement.style.position = 'absolute';
        measureElement.style.whiteSpace = 'nowrap';
        measureElement.innerText = text;

        document.body.appendChild(measureElement);

        if (measureElement.offsetWidth <= maxInPx) {
            document.body.removeChild(measureElement);
            return text;
        } else {
            let truncatedText = text;
            while (measureElement.offsetWidth > maxInPx) {
                truncatedText = truncatedText.slice(0, -1);
                measureElement.innerText = truncatedText + '...';
            }
            document.body.removeChild(measureElement);
            return truncatedText + '...';
        }
    }



#renderCellWithContent(context, x, y, content) {
    const xx = x * this.cellWidth + 0.5;
    const yy = y * this.cellHeight + 0.5;
    const right = xx + this.cellWidth;
    const bottom = yy + this.cellHeight;

    context.font = "12px serif";
    context.strokeStyle = "black";

    // Adjusted coordinates used for accessing cell content in cellMap
    const cellContent = this.cellMap.get(`${x},${y}`);
    if (cellContent !== undefined) {
        context.textAlign = 'center';
        context.fillText(this.#truncateText(cellContent, this.cellWidth), xx + this.cellWidth / 2, yy + this.cellHeight / 1.5);
    }

    context.beginPath();
    context.moveTo(xx, yy);
    context.lineTo(right, yy);
    context.lineTo(right, bottom);
    context.lineTo(xx, bottom);
    context.closePath();
    context.stroke();
}

    #renderCell(context, x, y) {
        const xx = x * this.cellWidth + 0.5;
        const yy = y * this.cellHeight + 0.5;
        const right = xx + this.cellWidth;
        const bottom = yy + this.cellHeight;

        context.strokeStyle = "#AAAAAA";

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
        context.strokeStyle = "skyblue";
        context.lineWidth = 2; // You can adjust the line width as needed
        context.strokeRect(x + 0.5, y + 0.5, this.cellWidth - 1, this.cellHeight - 1);
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

            // Adjusted coordinates for determining the selected cell
            const xx = this.#clamp(startX, this.cellWidth);
            const yy = this.#clamp(startY, this.cellHeight);

            const selectedCellContent = this.cellMap.get(`${Math.floor(xx / this.cellWidth)},${Math.floor(yy / this.cellHeight)}`);

            this.config?.onClick?.(selectedCellContent);

            if (selectedCellContent !== undefined) {
                //this.drawSelectedCell(context, xx, yy);
            }
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
