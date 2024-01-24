import { Injectable, Inject } from '@nestjs/common';
import { Worker } from 'worker_threads';

@Injectable()
export class WorkerPoolService {
  private workers: Worker[];
  private freeWorkers: Worker[];
  private queue: any[];
  private maxQueueSize = 100; // Maximum size of the queue

  constructor(
    @Inject('WORKER_FILE') workerFile: string,
    @Inject('POOL_SIZE') size: number,
  ) {
    this.workers = Array(size)
      .fill(null)
      .map(() => new Worker(workerFile));
    this.freeWorkers = [...this.workers];
    this.queue = [];
  }

  async run(taskData: any): Promise<any> {
    if (this.freeWorkers.length > 0) {
      const worker = this.freeWorkers.pop() as Worker;
      return this.runTask(worker, taskData);
    } else if (this.queue.length < this.maxQueueSize) {
      // If no free workers and the queue is not full, add the task to the queue
      return new Promise((resolve, reject) => {
        this.queue.push({ taskData, resolve, reject });
      });
    } else {
      throw new Error('Task queue is full');
    }
  }

  private async runTask(worker: Worker, taskData: any): Promise<any> {
    const timeout = 45000;
    const results = [];

    return Promise.race([
      new Promise<any>((resolve, reject) => {
        worker.on('message', (message) => {
          if (message.completed) {
            resolve(results);
          } else if (message.results) {
            // If the task is not completed, add the results to the results array
            const { keyword, engineName, links } = message.results;
            results.push({ keyword, engineName, links });
          } else {
            results.push({ error: message.error });
          }
        });
        worker.once('error', (error) => {
          reject(error);
        });
        worker.postMessage(taskData);
      }),
      new Promise((_, reject) =>
        setTimeout(() => {
          reject(new Error('Task execution timed out'));
        }, timeout),
      ),
    ]).finally(() => {
      this.freeWorkers.push(worker);

      if (this.queue.length > 0) {
        // If there are pending tasks, run the next one
        const nextTask = this.queue.shift();
        this.runTask(worker, nextTask.taskData)
          .then(nextTask.resolve)
          .catch(nextTask.reject);
      }
    });
  }

  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}
