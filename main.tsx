/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import {
  ArchivePage,
  HomePage,
  NewsPage,
  NotFoundPage,
} from "./components.tsx";
import { parse as frontMatter } from "https://deno.land/x/frontmatter@v0.1.5/mod.ts";
import { default as removeMarkdown } from "https://esm.sh/remove-markdown@0.5.0";
import { serve } from "https://deno.land/std@0.146.0/http/mod.ts";
import { h, html } from "https://deno.land/x/htm@0.0.10/mod.tsx";
import * as gfm from "https://deno.land/x/gfm@0.1.22/mod.ts";
import { UnoCSS } from "https://deno.land/x/htm@0.0.10/plugins.ts";

html.use(UnoCSS());

export interface Options {
  title: string;
  author: string;
  description?: string;
  repository: string;
  labels?: Array<string>;
  token?: string;
}

const NEWS = new Map<string, News>();

export interface News {
  pathname: string;
  markdown: string;
  title: string;
  publishDate: Date;
  author?: string;
  snippet?: string;
}

const htmlOpts = {
  styles: [
    `body { font-family: 'Inter', sans-serif; }`,
  ],
  links: [{
    href: "https://rsms.me/inter/inter.css",
    rel: "stylesheet",
  }],
};

export async function news(options: Options) {
  await setupNews(options);

  serve((req) => {
    const { pathname } = new URL(req.url);

    if (pathname === "/") {
      return html({
        colorScheme: "auto",
        title: options.title,
        body: <HomePage details={options} />,
        ...htmlOpts,
      });
    }

    if (pathname === "/archive") {
      return html({
        colorScheme: "auto",
        title: options.title,
        body: <ArchivePage news={NEWS} />,
        ...htmlOpts,
      });
    }

    const news = NEWS.get(pathname);
    if (news) {
      return html({
        colorScheme: "auto",
        title: news.title,
        body: <NewsPage news={news} />,
        ...htmlOpts,
        styles: [
          gfm.CSS,
          `body { font-family: 'Inter', sans-serif; } .markdown-body {  font-family: 'Inter', sans-serif; --color-canvas-default: transparent !important; --color-canvas-subtle: #edf0f2; --color-border-muted: rgba(128,128,128,0.2); } .markdown-body img + p { margin: 16px; }`,
        ],
      });
    }

    return html({
      colorScheme: "auto",
      title: "Not found",
      body: <NotFoundPage />,
      status: 404,
      ...htmlOpts,
    });
  });
}

async function fetchIssues(options: Options, page: number) {
  const params = new URLSearchParams({
    per_page: "100",
    page: page.toString(),
    state: "all",
  });

  if (options.labels) {
    params.set("labels", options.labels.join(","));
  }

  const url =
    `https://api.github.com/repos/${options.repository}/issues?${params.toString()}`;

  const response = await fetch(url, {
    headers: options.token ? { "Authorization": `token ${options.token}` } : {},
  });

  if (!response.ok) return;
  return await response.json();
}

async function setupNews(options: Options) {
  let i = 1;
  while (true) {
    const issues = await fetchIssues(options, i);
    if (!issues) break;

    for (const issue of issues) {
      if (!issue.body || issue.pull_request) continue;

      const { content, data } = frontMatter(issue.body) as {
        data: Record<string, string>;
        content: string;
      };

      let snippet = data?.description;
      if (!snippet) {
        const maybeSnippet = content.split("\n\r")[0];
        if (maybeSnippet) {
          snippet = removeMarkdown(maybeSnippet.replace("\n", " ")).trimEnd() +
            "...";
        } else {
          snippet = `${content.split("\n")[0].slice(0, 64)}...`;
        }
      }

      const news: News = {
        title: data?.title ?? issue.title ?? "Untitled",
        author: data?.author ?? issue.user.login,
        pathname: `/archive/${data?.pathname ?? issue.number}`,
        snippet,
        markdown: content,
        publishDate: data?.publish_date
          ? new Date(data?.publish_date)
          : new Date(issue.created_at),
      };

      NEWS.set(`/archive/${issue.number}`, news);
      console.log(`Load: /archive/${issue.number}`);
    }

    if (issues.length !== 100) break;
    i++;
  }
}
