export interface Job {
  by: string;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
  url?: string | null;
}

const API_BASE_URL = "https://hacker-news.firebaseio.com/v0";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function fetchJobIds(): Promise<number[]> {
  return fetchJson<number[]>(`${API_BASE_URL}/jobstories.json`);
}

async function fetchJobDetails(id: number): Promise<Job> {
  return fetchJson<Job>(`${API_BASE_URL}/item/${id}.json`);
}

type QueryState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

type QueryOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

class QueryManager<T, Args extends any[]> {
  private state: QueryState<T> = {
    data: null,
    isLoading: false,
    error: null,
  };
  private listeners: Set<() => void> = new Set();

  constructor(private fetcher: (...args: Args) => Promise<T>) {}

  getState(): QueryState<T> {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setState(newState: Partial<QueryState<T>>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener());
  }

  async query(options: QueryOptions<T> = {}, ...args: Args): Promise<void> {
    this.setState({ isLoading: true, error: null });
    try {
      const data = await this.fetcher(...args);
      this.setState({ data, isLoading: false });
      options.onSuccess?.(data);
    } catch (error) {
      this.setState({ error: error as Error, isLoading: false });
      options.onError?.(error as Error);
    }
  }
}

export { QueryManager, fetchJobDetails, fetchJobIds };
