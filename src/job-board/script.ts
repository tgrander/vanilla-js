import { formatDate, loadCSS } from "@/utils";
import {
  Job,
  QueryManager,
  fetchJobDetails,
  fetchJobIds,
} from "./script/queryStateManager";

import html from "noop-tag";

export class JobBoard {
  private container: HTMLElement;
  private jobList!: HTMLUListElement;
  private loadMoreButton!: HTMLButtonElement;
  private jobIdsManager: QueryManager<number[], []>;
  private jobDetailsManager: QueryManager<Job[], Array<number[]>>;
  private currentIndex: number = 0;
  private batchSize: number = 6;

  constructor() {
    this.container = document.getElementById("container") as HTMLElement;
    this.initUI();

    this.jobIdsManager = new QueryManager(fetchJobIds);
    this.jobDetailsManager = new QueryManager(this.fetchMultipleJobDetails);

    this.jobIdsManager.subscribe(() => this.handleJobIdsUpdate());
    this.jobDetailsManager.subscribe(() => this.handleJobDetailsUpdate());

    this.loadInitialData();
  }

  /**
   * INIT UI
   */
  private initUI() {
    this.container.innerHTML = html`
      <ul id="job-list" aria-live="polite"></ul>
      <button id="load-more" disabled>Load More</button>
    `;

    (document.querySelector("h1.heading") as HTMLHeadingElement).textContent =
      "Hacker News Job Board";

    this.jobList = this.container.querySelector(
      "#job-list"
    ) as HTMLUListElement;

    this.loadMoreButton = this.container.querySelector(
      "#load-more"
    ) as HTMLButtonElement;

    this.loadMoreButton.addEventListener("click", () => this.loadMoreJobs());

    loadCSS("job-board");
  }

  /**
   * DATA FETCHING
   */
  private async loadInitialData() {
    await this.jobIdsManager.query();
  }

  private handleJobIdsUpdate() {
    const { data, error } = this.jobIdsManager.getState();
    if (error) {
      this.showError("Failed to fetch job IDs");
    } else if (data) {
      this.loadMoreJobs();
    }
  }

  private handleJobDetailsUpdate() {
    const { data, error } = this.jobDetailsManager.getState();
    if (error) {
      this.showError("Failed to fetch job details");
    } else if (data) {
      this.renderJobs(data);
    }
  }

  private async loadMoreJobs() {
    const jobIds = this.jobIdsManager.getState().data;
    if (!jobIds) return;

    const nextBatch = jobIds.slice(
      this.currentIndex,
      this.currentIndex + this.batchSize
    );
    if (nextBatch.length === 0) {
      this.loadMoreButton.disabled = true;
      return;
    }

    await this.jobDetailsManager.query({}, nextBatch);
    this.currentIndex += this.batchSize;
    this.loadMoreButton.disabled = this.currentIndex >= jobIds.length;
  }

  private fetchMultipleJobDetails = async (
    jobIds: number[]
  ): Promise<Job[]> => {
    return Promise.all(jobIds.map(fetchJobDetails));
  };

  private showError(message: string) {
    const errorElement = document.createElement("p");
    errorElement.textContent = message;
    errorElement.className = "error";
    this.container.insertBefore(errorElement, this.jobList);
  }

  /**
   * JOB LIST
   */
  private renderJobs(jobs: Job[]) {
    jobs.forEach((job) => {
      const li = document.createElement("li");
      li.className = "job";
      li.innerHTML = `
        <div class="job-card">
          <h3>${this.createJobTitle(job)}</h3>
          <div class="metadata">
            <span>By ${job.by}</span>
            <span>-</span>
            <span>${formatDate(job.time)}</span>
          </div>
        </div>
      `;
      this.jobList.appendChild(li);
    });
  }

  private createJobTitle(job: Job): string {
    const title = job.title;
    return job.url
      ? `<a href="${job.url}" target="_blank" rel="noopener noreferrer">${title}</a>`
      : title;
  }
}

new JobBoard();
