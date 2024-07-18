interface Employee {
  name: string;
  title: string;
  children?: Employee[];
}

export class OrgChart {
  private container: HTMLElement;
  private data: Employee;
  private searchInput: HTMLInputElement;
  private searchButton: HTMLButtonElement;

  constructor(containerId: string, data: Employee) {
    const container = document.getElementById(containerId);
    if (container === null) throw "Container element not found";
    this.container = container;

    this.data = data;

    const input = document.getElementById("search-input");
    if (input === null) throw "Search input element not found";
    this.searchInput = input as HTMLInputElement;

    const searchButton = document.getElementById("search-button");
    if (searchButton === null) throw "Search button element not found";
    this.searchButton = searchButton as HTMLButtonElement;

    this.init();
  }

  private init(): void {
    this.render();
    this.setupEventListeners();
  }

  private render(): void {
    const chart = this.createChart(this.data);
    this.container.innerHTML = "";
    this.container.appendChild(chart);

    const orgChart = this.container.querySelector("ul");
    if (!orgChart) throw "Container element must have a `ul` child";
    orgChart.className = "org-chart";
  }

  private createChart(employee: Employee): HTMLElement {
    const ul = document.createElement("ul");

    const li = document.createElement("li");
    const node = this.createNode(employee);
    li.appendChild(node);

    if (employee.children && employee.children.length > 0) {
      const childrenUl = document.createElement("ul");
      employee.children.forEach((child) => {
        childrenUl.appendChild(this.createChart(child));
      });
      li.appendChild(childrenUl);
    }

    ul.appendChild(li);
    return ul;
  }

  // Create Node
  private createNode(employee: Employee): HTMLElement {
    const node = document.createElement("div");
    node.className = "node";
    node.innerHTML = `
          <div class="name">${employee.name}</div>
          <div class="title">${employee.title}</div>
      `;
    return node;
  }

  // Setup Event Listeners
  private setupEventListeners() {
    // Enter key pressed in search input
    this.searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.handleSearch();
      }
    });

    // Click search button
    this.searchButton.addEventListener("click", () => {
      this.handleSearch();
    });
  }

  private handleSearch() {
    // User presses Enter key or search button
    // Add event listener to input field and search button that triggers this function
    // Get the input field value
    const searchValue = this.searchInput.value.trim().toLocaleLowerCase();

    // ONly continue if search input value is valid
    if (searchValue.length > 0) {
      // Traverse the org chart tree and check the name and title of each node for a match
      const nodes = this.container.getElementsByClassName("node");
      Array.from(nodes).forEach((node) => {
        const name =
          node.getElementsByClassName("name")[0]?.textContent?.toLowerCase() ??
          "";
        const title =
          node.getElementsByClassName("title")[0]?.textContent?.toLowerCase() ??
          "";

        // If a match, add `highlight` class to the node
        if (name !== null && name.includes(searchValue)) {
          node.classList.add("highlight");
        }
        if (title !== null && title.includes(searchValue)) {
          node.classList.add("highlight");
        }
      });
    }
  }
}

const orgData: Employee = {
  name: "John Doe",
  title: "CEO",
  children: [
    {
      name: "Jane Smith",
      title: "CTO",
      children: [
        {
          name: "Bob Johnson",
          title: "Developer",
        },
      ],
    },
    {
      name: "Mike Brown",
      title: "CFO",
    },
  ],
};

new OrgChart("org-chart-container", orgData);
