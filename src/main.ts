interface EmployeeNode {
  name: string;
  title: string;
  children?: Array<EmployeeNode>;
}

const data: EmployeeNode = {
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

/**
 * FEATURES
 * - Render org chart HTML as tree structure
 * - Each employee node in org chart displays name + title
 * - Nodes with children can be expanded/collapsed
 * - Search functionality to highlight matching nodes
 * - Implement drag and drop to reorg chart
 *
 * REQUIREMENTS
 * - Vanilla JS
 * - Responsive
 */

export class OrgChart {
  private container: HTMLElement;
  private data: EmployeeNode;

  constructor(containerId: string, data: EmployeeNode) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw `No container element found with id ${containerId}`;
    }
    this.container = container;
    this.data = data;
    this.render();
  }

  render() {
    const chart = this.createChart(this.data);
    this.container.innerHTML = "";
    this.container.appendChild(chart);
  }

  createChart(rootNode: EmployeeNode) {
    const ul = document.createElement("ul");
    ul.className = "org-chart";

    const li = document.createElement("li");
    const node = this.createEmployeeNode(rootNode);
    li.appendChild(node);

    if (rootNode.children && rootNode.children.length > 0) {
      const childrenList = document.createElement("ul");

      rootNode.children.forEach((child) => {
        childrenList.appendChild(this.createChart(child));
      });

      li.appendChild(childrenList);
    }

    ul.appendChild(li);
    return ul;
  }

  // Create employee node
  createEmployeeNode(employee: EmployeeNode): HTMLDivElement {
    const node = document.createElement("div");
    node.classList.add("node");

    const name = document.createElement("p");
    name.className = "name";
    name.textContent = employee.name;

    const title = document.createElement("p");
    title.textContent = employee.title;
    title.className = "title";

    node.appendChild(name);
    node.appendChild(title);

    return node;
  }
}

new OrgChart("chart-container", data);

/**
 * Example output"
 *
 *`
  <ul>
    <li>John Doe</li>
    <ul>
      <li>
        Jane Smith
        <ul>
          <li>Bob Johnson</li>
        </ul>
      </li>
      <li>Mike Brown</li>
    </ul>
  </ul>
`;
 */
