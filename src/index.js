export class Spreadsheet {
    constructor() {
        this.height = 400;

        this.maxCellX = 100;
        this.maxCellY = 100;

        this.cellWidth = 60;
        this.cellHeight = 15;

        this.width = 900 + this.cellWidth/2;
    }

    renderCell(context, x, y) {
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

    getColumnName(index) {
        let columnName = "";
        let quotient = index;

        while (quotient >= 0) {
            const remainder = quotient % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            quotient = Math.floor(quotient / 26) - 1;
        }

        return columnName;
    }

    getColumnBar() {
        const columnBar = document.createElement("div");
        columnBar.style.display = "flex";
        columnBar.style.position = "relative";
        columnBar.style.textAlign = "center";
        columnBar.style.left = this.cellWidth / 2 + "px";
        columnBar.classList.add("ss__column-bar");

        for (let i = 0; i < this.maxCellX; i++) {
            const columnHead = document.createElement("div");
            columnHead.style.minWidth = this.cellWidth + "px";
            columnHead.textContent = this.getColumnName(i); 
            columnBar.appendChild(columnHead);
        }
        return columnBar;
    }


    getRowBar(onClick) {
        const rowBar = document.createElement("div");
        rowBar.classList.add("ss__row-bar");

        for (let i = 0; i < this.maxCellY; i++) {
            const rowHead = document.createElement("div");
            rowHead.style.width = this.cellWidth/2 + "px";
            rowHead.style.textAlign = "center";
            rowHead.textContent = `${i + 1}`;
            rowHead.setAttribute("data-pos", i);

            rowHead.addEventListener("click", onClick);

            rowBar.appendChild(rowHead);
        }

        return rowBar;
    }

    bind(elem) {
        elem.style.overflow = "scroll";
        elem.style.width = this.width + "px";
        elem.style.height = this.height + "px";
        elem.style.display = "flex";
        elem.style.flexDirection = "column";

        const columnBar = this.getColumnBar();
        elem.appendChild(columnBar);

        const container = document.createElement("div");
        container.style.display = "flex";
        container.classList.add("ss__container");

        const rowBar = this.getRowBar((e) => {
            const isRowSelected = Number(e.target.getAttribute("data-selected"));

            if (isRowSelected) {
                e.target.style.outline = "none";

                const y = e.target.getAttribute("data-pos") * this.cellHeight;
                const context = canvas.getContext("2d");
                context.clearRect(0.5, y + 0.5, this.width * this.cellWidth, this.cellHeight); 
                e.target.setAttribute("data-selected", 0); 
            } else {
                e.target.style.outline = "1px solid #191919";

                const y = e.target.getAttribute("data-pos") * this.cellHeight;
                const context = canvas.getContext("2d");
                context.strokeStyle = "#191919";
                context.strokeRect(0.5, y + 0.5, this.width * this.cellWidth, this.cellHeight);
                e.target.setAttribute("data-selected", 1); 
            }
        });

        container.appendChild(rowBar);

        const canvas = document.createElement("canvas");

        canvas.width = this.maxCellX * this.cellWidth;
        canvas.height = this.maxCellY * this.cellHeight;

        const context = canvas.getContext("2d");

        context.strokeStyle = "#AAAAAA";
        context.lineWidth = 1;
        context.imageSmoothingEnabled = false;

        for (let i = 0; i < this.maxCellY; i++) {
            for (let j = 0; j < this.maxCellX; j++) {
                this.renderCell(context, j, i);
            }
        }

        container.appendChild(canvas);
        elem.appendChild(container);
    }
}
