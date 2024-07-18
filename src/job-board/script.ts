import { loadCSS } from "@/utils/loadCSS";
// import html from "noop-tag";

/**
 * - Fetch job postings from HN API
 *    - First fetch job posting IDs
 *    - Initial fetch for 6 postings when page first mounts
 *
 * - Render list of job postings:
 *    - job title, poster, date
 *    - If job posting contains a url, make the job title a link that opens the job details page in a new window when clicked.
 *    - Format timestamp
 *
 * - 'Load More' button to fetch the next six postings
 *    - Disable button if response from API contains less than 6 postings
 */

/**
 * API ENDPOINTS:
 * ==============
 *
 * GET: Job IDs
 * URL: https://hacker-news.firebaseio.com/v0/jobstories.json
 * Content Type: json
 *
 *
 * GET: Job Details
 * URL: https://hacker-news.firebaseio.com/v0/item/{id}.json
 * Content Type: json
 */

interface Job {
  by: string;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
  url?: string | null;
}

async function fetcher(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok)
      throw new Error("Network response was not ok " + response.statusText);

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error("There was a problem with the fetch operation: " + error);
  }
}

export class JobBoard {
  jobIds: number[] = [];
  jobs: Job[] = [];

  constructor() {
    this.initAppShell();
    // Event Listeners
    this.addEventListeners();
  }

  /**
   * INIT SPREADSHEET
   */
  private initAppShell() {
    // Set heading text
    this.setHeadingText();
    // Load CSS
    loadCSS("spreadsheet");
  }

  private setHeadingText() {
    (document.querySelector("h1") as HTMLHeadingElement).textContent =
      "Hacker News Job Board";
  }

  // Add Event Listeners
  private addEventListeners() {}
}

new JobBoard();
