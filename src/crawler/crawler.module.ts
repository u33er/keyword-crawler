import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { WorkerPoolService } from '../lib/worker-pool.service';
import { AggregatorService } from '../lib/aggregator.service';
import { join } from 'path';

@Module({
  controllers: [CrawlerController],
  providers: [
    CrawlerService,
    AggregatorService,
    WorkerPoolService,
    {
      provide: 'WORKER_FILE',
      useValue: join(__dirname, '../main.worker'),
    },
    {
      provide: 'POOL_SIZE',
      useValue: 5,
    },
  ],
})
export class CrawlerModule {}
