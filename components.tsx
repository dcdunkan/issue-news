/** @jsx h */
/** @jsxFrag Fragment */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import type { News, Options } from "./main.tsx";
import { h } from "https://deno.land/x/htm@0.0.10/mod.tsx";
import * as gfm from "https://deno.land/x/gfm@0.1.22/mod.ts";

export function HomePage({ details }: { details: Options }) {
  return (
    <div class="max-w-screen-sm h-full px-6 mx-auto flex flex-col items-center justify-center">
      <header class="w-full h-90 lt-sm:h-80 bg-cover bg-center bg-no-repeat">
        <div class="h-full text-center flex select-none all:transition-400">
          <div class="ma">
            <div class="text-4xl fw500">{details.title}</div>
            {details.description
              ? (
                <div class="text-lg fw400 m1">
                  {details.description}
                </div>
              )
              : ""}
          </div>
        </div>
      </header>

      <div class="select-none absolute bottom-5 right-0 left-0 text-center fw300">
        <a
          class="hover='op80' underline underline-from-font"
          href="/archive"
        >
          Archive
        </a>
      </div>
    </div>
  );
}

export function ArchivePage({ news }: { news: Map<string, News> }) {
  const newsIndex = [];
  for (const [_key, news_] of news.entries()) {
    newsIndex.push(news_);
  }

  return (
    <div class="mx-6 select-none">
      {
        <header class="w-full mt-10">
          <div class="max-w-screen-sm h-full mx-auto flex-col justify-center">
            <h1 class="mt-3 text-4xl text-gray-900 dark:text-gray-100 fw500">
              Archive
            </h1>
          </div>
        </header>
      }

      <div class="max-w-screen-sm mx-auto mb-12">
        <div class="pt-12 lt-sm:pt-12">
          {newsIndex.length > 0
            ? newsIndex.map((news) => (
              <NewsCard
                key={news.pathname}
                news={news}
                timezone="en-US"
              />
            ))
            : "No news!"}
        </div>
      </div>
    </div>
  );
}

export function NewsPage({ news }: { news: News }) {
  const html = gfm.render(news.markdown);
  return (
    <div class="max-w-screen-sm px-6 pt-8 mx-auto mb-10">
      <div class="pb-16">
        <a
          href="/archive"
          class="inline-flex items-center gap-1 text-sm text-gray-500/80 hover:text-gray-700 transition-colors"
          title="Back to Archive"
        >
          <svg
            className="inline-block w-5 h-5"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.91675 14.4167L3.08341 10.5833C3.00008 10.5 2.94119 10.4097 2.90675 10.3125C2.87175 10.2153 2.85425 10.1111 2.85425 10C2.85425 9.88889 2.87175 9.78472 2.90675 9.6875C2.94119 9.59028 3.00008 9.5 3.08341 9.41667L6.93758 5.5625C7.09036 5.40972 7.27786 5.33334 7.50008 5.33334C7.7223 5.33334 7.91675 5.41667 8.08341 5.58334C8.23619 5.73611 8.31258 5.93056 8.31258 6.16667C8.31258 6.40278 8.23619 6.59722 8.08341 6.75L5.66675 9.16667H16.6667C16.9029 9.16667 17.1006 9.24639 17.2601 9.40584C17.4201 9.56584 17.5001 9.76389 17.5001 10C17.5001 10.2361 17.4201 10.4339 17.2601 10.5933C17.1006 10.7533 16.9029 10.8333 16.6667 10.8333H5.66675L8.10425 13.2708C8.25703 13.4236 8.33341 13.6111 8.33341 13.8333C8.33341 14.0556 8.25008 14.25 8.08341 14.4167C7.93064 14.5694 7.73619 14.6458 7.50008 14.6458C7.26397 14.6458 7.06953 14.5694 6.91675 14.4167Z"
              fill="currentColor"
            />
          </svg>
          ARCHIVE
        </a>
      </div>
      <article>
        <h1 class="text-4xl text-gray-900 dark:text-gray-100 fw400">
          {news.title}
        </h1>
        <p class="mt-1 text-gray-500">
          {(news.author) && (
            <span>
              By {news.author} at {" "}
            </span>
          )}
          <PrettyDate date={news.publishDate} />
        </p>
        <div
          class="mt-8 markdown-body"
          data-color-mode="auto"
          data-light-theme="light"
          data-dark-theme="dark"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div class="max-w-screen-sm h-full px-6 mx-auto flex flex-col items-center justify-center">
      <header class="w-full h-90 lt-sm:h-80 bg-cover bg-center bg-no-repeat">
        <div class="h-full text-center flex select-none all:transition-400">
          <div class="ma">
            <div class="text-4xl fw500">
              Couldn't find what you're looking for :(
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

function NewsCard({ news, timezone }: { news: News; timezone: string }) {
  return (
    <div class="pt-12 first:pt-0">
      <h3 class="text-2xl fw400">
        <a class="" href={news.pathname}>
          {news.title}
        </a>
      </h3>
      <p class="text-gray-500/80">
        <PrettyDate date={news.publishDate} timezone={timezone} />
      </p>
      <p class="mt-3 text-gray-600 dark:text-gray-400">
        {news.snippet}
      </p>
      <p class="mt-3">
        <a
          class="leading-tight text-gray-900 dark:text-gray-100 inline-block border-b-1 border-gray-600 hover:text-gray-500 hover:border-gray-500 transition-colors"
          href={news.pathname}
          title={`Read "${news.title}"`}
        >
          Read More
        </a>
      </p>
    </div>
  );
}

function PrettyDate({ date, timezone }: { date: Date; timezone?: string }) {
  const formatted = date.toLocaleDateString(timezone ?? "en-US");
  return <time dateTime={date.toISOString()}>{formatted}</time>;
}
