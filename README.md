# nyaa-ts

TypeScript Wrapper for Nyaa Torrent website.

Mainly for searching animes directly via a wrapper to get the magnet. :)

## Install

```bash
npm install nyaa-ts
```

## Usage

```ts
import NyaaClient from 'nyaa-ts';

const client = new NyaaClient();
client.search('frieren', {
  limit: 5,
  sort: 'seeders',
  order: 'desc',
}).then(console.log).catch(console.error);
```

Each result contains:

- `title`
- `link`
- `magnetLink`
- `pubDate`
- `size`
- `seeders`
- `leechers`
- `downloads`

## Options

- `limit`: maximum number of results to return
- `sort`: `downloads`, `seeders`, `leechers`, `pubDate`, or `size`
- `order`: `asc` or `desc`

## Notes

- If the webiste changes, this will break, and need a fix :/
- If your project uses ESM, top-level `await` also works.
