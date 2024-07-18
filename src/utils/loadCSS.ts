type Feature = "org-chart" | "spreadsheet" | "job-board";

export function loadCSS(feature: Feature) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = `src/${feature}/styles.css`;
  document.head.appendChild(link);
}
