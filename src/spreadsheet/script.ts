import { loadCSS } from "@/utils/loadCSS";

/**
 * - Create Cell interface with properties: column (A, B, C), row (1,2,3), value (str)
 * - Create 10x10 grid using a 2D array
 *
 * FEATURES
 * ---------
 * Cell Functionality:
 * - Can select table
 * - Can input and edit text or numbers in each cell
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

class Cell {
  value: string = "";
  element: HTMLTableCellElement;

  constructor(element: HTMLTableCellElement) {
    this.element = element;
  }
}

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
    const app = document.querySelector(".app");
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
        cell.contentEditable = "true";
        // Create dataset attr for row
        cell.dataset.row = i.toString();
        // // Create dataset attr for column
        cell.dataset.col = j.toString();
        // Complete the cells 2D grid by creating new Cell at position (i, j)
        this.cells[i][j] = new Cell(cell);
      }
    }

    // Append spreadsheet grid to container element
    this.container.appendChild(table);
  }

  // Init Event Listeners
  private initEventListeners() {}

  // Handle Cell Click
  private handleCellClick(event: Event) {
    const target = event.target as HTMLTableCellElement;

    if (target.tagName === "TD") {
      this.selectCell(target);
    }
  }

  // Select Cell
  private selectCell(cellElement: HTMLTableCellElement) {}
}

// Instantiate spreadsheet app in index.html
new Spreadsheet();
