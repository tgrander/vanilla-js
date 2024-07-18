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

const pageTitle = "Hacker News Job Board";

const jobIdsUrl = "https://hacker-news.firebaseio.com/v0/jobstories.json";

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

async function fetchJobIds() {
  return await fetcher(jobIdsUrl);
}

async function fetchJobDetails(id: number) {
  const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
  return await fetcher(url);
}

/**
 * INITIAL FETCH REQUEST
 * Fetch the job IDs
 * How to handle loading states???
 * Store response in class state
 * Request job details of first six job IDs
 *    - Have to request details individually => use Promise.all()
 * Create new JobCard components for each job details data item
 * Render job details list items to the app
 *
 *
 * LOAD MORE JOBS
 * Create button element and append to bottom of jobs list
 * Add click event listener
 *    - Does nothing if all jobs have been requested
 *    - Makes fetch request for the next six job details
 *
 */

export class JobBoard {
  jobIds: number[] = [];
  jobs: Job[] = [];
  container: HTMLElement;

  constructor() {
    this.container = document.getElementById("container") as HTMLElement;
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
    //

    // Load CSS
    loadCSS("job-board");
  }

  private setHeadingText() {
    (document.querySelector("h1") as HTMLHeadingElement).textContent =
      pageTitle;
    document.title = pageTitle;
  }

  // Add Event Listeners
  private addEventListeners() {}
}

new JobBoard();
