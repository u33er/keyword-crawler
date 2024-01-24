import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('api/v1/sponsored-links')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get()
  getSponsoredLinks(
    @Query('pages') pages: number,
    @Query('keywords') keywords: string,
  ) {
    const keywordList = keywords.split(',');
    return this.crawlerService.getSponsoredLinks(pages, keywordList);
  }
}
