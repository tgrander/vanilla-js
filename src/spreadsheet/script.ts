import { loadCSS } from "@/utils/loadCSS";
import html from "noop-tag";

/**
 * - Create Cell interface with properties: column (A, B, C), row (1,2,3), value (str)
 * - Create 10x10 grid using a 2D array
 *
 * FEATURES
 * ---------
 * Cell Functionality:
 * ✅ Can select table cell
 * ✅ Can input and edit text or numbers in each cell
 * - Can implement basic formatting, i.e. bold, italic, underline
 *
 * Formula Support:
 * - Support basic arithmetic operations (+, -, *, /)
 * - Implement SUM function for a range of cells
 * - Allow referencing other cells in formulas (e.g., =A1+B2)
 *
 * Dynamic Updates:
 * - Recalculate dependent cells when a referenced cell changes
 *
 * UI/UX:
 * - Implement a way to select multiple cells (for copying, pasting, or applying the SUM function)
 * - Add a formula bar to display and edit cell contents
 *
 * Error Handling:
 * - Detect and display circular references
 * - Show appropriate error messages for invalid formulas
 */

type Format = "bold" | "italic" | "underline";

class Cell {
  value: string = "";
  element: HTMLTableCellElement;
  formatting: Set<Format> = new Set();

  constructor(element: HTMLTableCellElement) {
    this.element = element;
  }
}

const rowAttribute = "row";
const colAttribute = "col";
const selectedClass = "selected";
const editableDivSelector = "div.editable";

const TAG_NAMES = {
  TD: "TD",
  // Add more as needed
} as const;

export class Spreadsheet {
  private gridSize = 10;
  private container: HTMLElement;
  private cells: Cell[][] = [];
  private selectedCell: Cell | null = null;

  constructor() {
    const { container } = this.initAppShell();
    this.container = container;

    // Create and render grid
    this.createGrid();
    // Event Listeners
    this.addEventListeners();
  }

  /**
   * INIT SPREADSHEET
   */
  private initAppShell() {
    // Set heading text
    this.setHeadingText();

    // Render container
    const container = this.renderContainer();

    // Load CSS
    loadCSS("spreadsheet");

    // Return reference to container element
    return { container };
  }

  private setHeadingText() {
    const h1 = document.querySelector(".heading");
    if (h1 === null) throw new Error("Heading not found");
    h1.textContent = "";
    h1.textContent = "Custom Spreadsheet";
  }

  private renderContainer(): HTMLElement {
    // Get app element and clear contents
    const app = document.getElementById("app");
    if (app === null) throw new Error("App element not found");
    app.innerHTML = "";

    // Create container element
    const container = document.createElement("main");
    container.id = "container";

    // Append to app
    app.appendChild(container);

    return container;
  }

  /**
   * CREATE SPREADSHEET GRID
   */
  private createGrid() {
    // Create table element
    const table = document.createElement("table");

    // Create table rows equal to grid size
    for (let i = 0; i < this.gridSize; i++) {
      const row = table.insertRow();
      this.cells[i] = [];

      // Create row cells equal to grid size
      for (let j = 0; j < this.gridSize; j++) {
        const cell = row.insertCell();
        // Enable cell for user input
        // cell.contentEditable = "true";
        // Create dataset attr for row
        cell.dataset[rowAttribute] = i.toString();
        // // Create dataset attr for column
        cell.dataset[colAttribute] = j.toString();
        // Complete the cells 2D grid by creating new Cell at position (i, j)
        this.cells[i][j] = new Cell(cell);

        // Editable div to control cell interactions
        cell.innerHTML = html`
          <div class="editable" contenteditable="false"></div>
        `;
      }
    }

    // Append spreadsheet grid to container element
    this.container.appendChild(table);
  }

  // Add Event Listeners
  private addEventListeners() {
    this.container.addEventListener("click", this.handleCellClick.bind(this));
    this.container.addEventListener("input", this.handleCellInput.bind(this));
    this.container.addEventListener(
      "dblclick",
      this.handleCellDoubleClick.bind(this)
    );
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  // Handle Cell Click
  private handleCellClick(event: Event) {
    if (isTableCellEvent(event)) {
      this.handleSelectCell(event.target as HTMLTableCellElement);
    }
  }

  // Select Cell
  private handleSelectCell(cellElement: HTMLTableCellElement) {
    // remove `selected` class from prev selected cell
    if (this.selectedCell) {
      this.selectedCell.element.classList.remove(selectedClass);

      // Prev selected div not editable
      const editableDiv = this.selectedCell.element.querySelector(
        "div.editable"
      ) as HTMLDivElement;

      if (editableDiv) {
        editableDiv.contentEditable = "false";
        editableDiv.blur();
      }
    }

    // Get Cell class in cells grid at position (row, col)
    // Set selected cell to Cell
    this.selectedCell = this.getCellFromElement(cellElement).cell;
    // Add `selected` class anme to grid Cell's element
    this.selectedCell.element.classList.add(selectedClass);
    this.selectedCell.element.focus();
  }

  private handleCellInput(event: Event) {
    const target = event.target as HTMLTableCellElement;

    if (target.tagName === "TD") {
      // Get cell col and row from target element
      const { cell } = this.getCellFromElement(target);
      cell.value = target.textContent ?? "";
    }
  }

  private handleKeyPress(event: KeyboardEvent) {
    this.handleCellKeyPressEnter(event);
    this.handleFormattingKeyPress(event);
  }

  private handleCellKeyPressEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (this.selectedCell) {
        event.preventDefault();
        this.toggleCellEditable(this.selectedCell.element);
      }
    }
  }

  private handleCellDoubleClick(event: Event) {
    const target = event.target as HTMLTableCellElement as HTMLTableCellElement;

    if (isTableCellElement(target) && this.selectedCell) {
      this.toggleCellEditable(this.selectedCell?.element);
    }
  }

  private toggleCellEditable(selectedCellElement: HTMLTableCellElement) {
    const editableDiv = selectedCellElement.querySelector(
      "div.editable"
    ) as HTMLDivElement;

    if (editableDiv) {
      editableDiv.contentEditable =
        editableDiv.contentEditable === "true" ? "false" : "true";

      editableDiv.contentEditable === "true"
        ? editableDiv.focus()
        : editableDiv.blur();
    }
  }

  private getCellFromElement(element: HTMLTableCellElement) {
    const row = parseInt(element.dataset[rowAttribute] ?? "0");
    const col = parseInt(element.dataset[colAttribute] ?? "0");
    const cell = this.cells[row][col];

    return {
      row,
      col,
      cell,
    };
  }

  private handleFormattingKeyPress(event: KeyboardEvent) {
    if (
      (event.metaKey || event.ctrlKey) &&
      ["b", "i", "u"].includes(event.key.toLowerCase()) &&
      this.selectedCell
    ) {
      event.preventDefault();

      const editableDiv = this.getEditableDiv();

      if (editableDiv && editableDiv.isContentEditable === false) {
        switch (event.key.toLowerCase()) {
          case "b":
            this.toggleCellFormat(editableDiv, "bold");
            break;
          case "i":
            this.toggleCellFormat(editableDiv, "italic");
            break;
          case "u":
            this.toggleCellFormat(editableDiv, "underline");
            break;
        }
      }
    }
  }

  private toggleCellFormat(editableDiv: HTMLDivElement, format: Format) {
    if (this.selectedCell?.formatting.has(format)) {
      this.selectedCell.formatting.delete(format);
      editableDiv.classList.remove(format);
    } else {
      this.selectedCell?.formatting.add(format);
      editableDiv.classList.add(format);
    }
  }

  private getEditableDiv() {
    if (this.selectedCell) {
      return this.selectedCell.element.querySelector(
        editableDivSelector
      ) as HTMLDivElement;
    }
    return null;
  }
}

function isTableCellEvent(event: Event) {
  const element = event.target as Element;
  return element.tagName === TAG_NAMES.TD;
}
function isTableCellElement(element: HTMLElement) {
  return element.tagName === TAG_NAMES.TD;
}

// Instantiate spreadsheet app in index.html
new Spreadsheet();
