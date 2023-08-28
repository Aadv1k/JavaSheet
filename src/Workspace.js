import Spreadsheet from "./Spreadsheet.js";

export default class Workspace {
    constructor(config) {
      this.width = config.width || 800;
      this.height = config.height || 800;
    }

    render(elem) {

        elem.style.overflow = "scroll";
        elem.style.width = this.width + "px";
        elem.style.height = this.height + "px";

        const spreadsheet = new Spreadsheet({
            width: this.width,
            height: this.height,
            onDrag: (e) => {
                console.log(spreadsheet.getSelected());
            }
        });

        spreadsheet.render(elem);
    }
}
