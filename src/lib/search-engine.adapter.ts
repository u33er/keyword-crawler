export interface SearchEngine {
  getUrl(keyword: string, page: number): string;
  getSelector(): string;
  getName(): string;
}

export class GoogleEngine implements SearchEngine {
  getName(): string {
    return 'Google';
  }
  getSelector(): string {
    return 'div';
  }
  getUrl(keyword: string, page: number): string {
    return `https://www.google.com/search?q=${keyword}&start=${(page - 1) * 10}`;
  }
}

export class BingEngine implements SearchEngine {
  getName(): string {
    return 'Bing';
  }
  getSelector(): string {
    return 'div';
  }
  getUrl(keyword: string, page: number): string {
    return `https://www.bing.com/search?q=${keyword}&start=${(page - 1) * 10}`;
  }
}

export class YahooEngine implements SearchEngine {
  getName(): string {
    return 'Yahoo';
  }
  getSelector(): string {
    return 'div';
  }
  getUrl(keyword: string, page: number): string {
    return `https://search.yahoo.com/search?p=${keyword}&b=${(page - 1) * 10}`;
  }
}

const googleEngine = new GoogleEngine();
const bingEngine = new BingEngine();
const yahooEngine = new YahooEngine();

export const searchEngines = {
  Google: googleEngine,
  Bing: bingEngine,
  Yahoo: yahooEngine,
};
