import { Injectable } from '@nestjs/common';
import { WorkerPoolService } from '../lib/worker-pool.service';

@Injectable()
export class AggregatorService {
  constructor(private readonly workerPoolService: WorkerPoolService) {}

  runTasks(pages: number, keywords: string[]) {
    // Run a task for each keyword and wait for all tasks to complete
    return Promise.all(
      keywords.map((keyword) => this.workerPoolService.run({ pages, keyword })),
    );
  }
}
