import { Injectable } from '@nestjs/common';
import { AggregatorService } from '../lib/aggregator.service';

@Injectable()
export class CrawlerService {
  constructor(private readonly aggregatorService: AggregatorService) {}

  getSponsoredLinks(pages: number, keywords: string[]) {
    return this.aggregatorService.runTasks(pages, keywords);
  }
}
