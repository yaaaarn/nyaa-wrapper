export type NyaaSortBy = 'downloads' | 'seeders' | 'leechers' | 'pubDate' | 'size';

export type NyaaSortOrder = 'asc' | 'desc';

export interface NyaaSearchOptions {
  limit?: number;
  sort?: NyaaSortBy;
  order?: NyaaSortOrder;
}
