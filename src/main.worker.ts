import * as puppeteer from 'puppeteer';
import { parentPort } from 'worker_threads';
import { SearchEngine, searchEngines } from './lib/search-engine.adapter';

export async function crawlKeyword(
  keyword: string,
  pages: number,
  engine: SearchEngine,
  browser: puppeteer.Browser,
): Promise<string[]> {
  const sponsoredLinks: string[] = [];

  const promises = Array.from({ length: pages }, async (_, i) => {
    const page = await browser.newPage();
    const url = engine.getUrl(keyword, i + 1);
    const querySelector = engine.getSelector();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const links = await page.evaluate(
      (selector) =>
        Array.from(document.querySelectorAll(selector)).map((link) => {
          const anchor = link.querySelector('a');
          return anchor ? anchor.getAttribute('href') : null;
        }),
      querySelector,
    );

    sponsoredLinks.push(...links.filter((link) => link !== null));
    await page.close();
  });

  await Promise.all(promises);
  return sponsoredLinks;
}

parentPort.on('message', async (message) => {
  const { keyword } = message;

  const browser = await puppeteer.launch();

  const promises = Object.keys(searchEngines).map((engine) =>
    crawlKeyword(keyword, message.pages, searchEngines[engine], browser)
      .then((links) =>
        postMessage({
          results: {
            keyword,
            engineName: searchEngines[engine].getName(),
            links,
          },
          completed: false,
        }),
      )
      .catch((error) =>
        postMessage({
          error: error.message,
          completed: false,
        }),
      ),
  );

  await Promise.all(promises);

  await browser.close();
  postMessage({ completed: true });
});

function postMessage(message: any) {
  parentPort.postMessage(message);
}
