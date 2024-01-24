# Keyword Crawler

This is a simple program built with NestJS and TypeScript to crawl and combine a list of sponsored links by given keywords over Google, Bing, and Yahoo.

## Modules

The program is composed of the following modules:

1. **Main Module**: Holds the REST API to seek sponsored links on the web.
2. **Worker Module**: Crawls the websites to combine the list of sponsored links.
3. **Aggregator Module**: Aggregates the results from all the workers and returns to the API.

## Endpoints

The available endpoint is:

- GET:: /api/v1/sponsored-links?pages={AMOUNT_OF_PAGES_TO_CRAWL}&keywords={LIST_OF_KEYWORDS_SEPARATED_WITH_COMMA}

## Running the Program

To run the program, follow these steps:

1. Install the dependencies with `npm install`.
2. Build the project with `npm run build`.
3. Start the server with `npm start`.

# Running the Program with Docker

You can also run the program with Docker. To do this, you'll need to have Docker installed on your machine.

1. Build the Docker image with `docker build -t keyword-crawler .`
2. Run the Docker container with `docker run -p 3000:3000 keyword-crawler`

The application will be available at `http://localhost:3000`.

## What to Expect

The program uses multiple concurrent workers to crawl the specified number of pages for each keyword on Google, Bing, and Yahoo. The results are then aggregated and returned via the REST API GET endpoint.
