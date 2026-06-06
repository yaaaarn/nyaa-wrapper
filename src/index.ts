import type { Cheerio } from 'cheerio';
import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import type { NyaaSearchOptions, NyaaSortBy, NyaaSortOrder } from './types/filter';
import type { NyaaResult } from './types/nyaaResult';

const SORT_MAP: Record<NyaaSortBy, string> = {
  downloads: 'downloads',
  leechers: 'leechers',
  pubDate: 'id',
  seeders: 'seeders',
  size: 'size',
};

export default class NyaaClient {
  private readonly baseUrl: string;
  private readonly searchUrl: URL;

  constructor(public readonly url = 'https://nyaa.si/') {
    this.baseUrl = url;
    this.searchUrl = new URL(url);
  }

  async search(query: string, options: NyaaSearchOptions = {}): Promise<NyaaResult[]> {
    const { limit, sort, order } = options;
    const url = this.buildSearchUrl(query, sort, order);
    const $ = await cheerio.fromURL(url);
    let rows = $('table.torrent-list > tbody > tr');

    if (limit !== undefined) {
      rows = rows.slice(0, limit);
    }

    const results: NyaaResult[] = [];
    rows.each((_, row) => {
      const r = this.parseRow($(row));
      r && results.push(r);
    });

    return results;
  }

  private parseRow($row: Cheerio<AnyNode>): NyaaResult | null {
    const td = $row.find('td');
    if (td.length < 8) {
      return null;
    }

    const titleLink = td.eq(1).find('a').last();
    const href = titleLink.attr('href');
    const magnetLink = td.eq(2).find('a[href^="magnet:"]').attr('href');
    if (!href || !magnetLink) {
      return null;
    }

    const seeders = this.parseNumber(td.eq(5).text());
    const leechers = this.parseNumber(td.eq(6).text());
    const downloads = this.parseNumber(td.eq(7).text());
    if (seeders === null || leechers === null || downloads === null) {
      return null;
    }

    return {
      title: titleLink.text().trim(),
      link: new URL(href, this.baseUrl).toString(),
      magnetLink,
      pubDate: td.eq(4).text().trim(),
      size: td.eq(3).text().trim(),
      seeders,
      leechers,
      downloads,
    };
  }

  private buildSearchUrl(query: string, sort?: NyaaSortBy, order?: NyaaSortOrder): string {
    const url = new URL(this.searchUrl);
    url.searchParams.set('f', '0');
    url.searchParams.set('c', '1_2');
    url.searchParams.set('q', query);

    if (sort && order) {
      url.searchParams.set('s', SORT_MAP[sort]);
      url.searchParams.set('o', order);
    }

    return url.toString();
  }

  private parseNumber(value: string): number | null {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
}

export { NyaaClient };
export type { NyaaResult } from './types/nyaaResult';
export type { NyaaSearchOptions, NyaaSortBy, NyaaSortOrder } from './types/filter';
