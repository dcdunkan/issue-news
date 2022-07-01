# <h1 align="center">The Issue News</h1>

Turn GitHub Issues to Newsletter. Inspired by [Deno News](https://deno.news/).

This is a work in progress. And documentation is also under work.

```ts
import { news } from "https://ghc.deno.dev/dcdunkan/issue-news@main/main.tsx";

news({
  title: "The IssueY News",
  author: "Author Name",
  repository: "owner/repository",
  // Optional.
  description: "Description",
  // GitHub Personal Access Token. It's optional.
  // But if rate limit hits, use a PAT.
  token: "PAT",
  // Optional. But you can provide labels to only list
  // issues with that labels as news.
  labels: ["news"],
});
```

You can deploy it on [Deno Deploy](https://deno.com/deploy). Here's a example
playground:
