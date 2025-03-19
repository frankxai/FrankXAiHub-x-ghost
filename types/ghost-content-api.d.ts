/**
 * Type declarations for Ghost Content API
 */
declare module '@tryghost/content-api' {
  interface GhostContentAPIOptions {
    url: string;
    key: string;
    version: string;
  }

  interface BrowseOptions {
    limit?: number | 'all';
    page?: number;
    order?: string;
    filter?: string;
    include?: string | string[];
    fields?: string | string[];
    formats?: string | string[];
  }

  interface ReadOptions {
    id?: string;
    slug?: string;
    include?: string | string[];
    fields?: string | string[];
    formats?: string | string[];
  }

  interface GhostAPI {
    posts: {
      browse(options?: BrowseOptions): Promise<any[]>;
      read(options?: ReadOptions): Promise<any>;
    };
    tags: {
      browse(options?: BrowseOptions): Promise<any[]>;
      read(options?: ReadOptions): Promise<any>;
    };
    authors: {
      browse(options?: BrowseOptions): Promise<any[]>;
      read(options?: ReadOptions): Promise<any>;
    };
    pages: {
      browse(options?: BrowseOptions): Promise<any[]>;
      read(options?: ReadOptions): Promise<any>;
    };
    settings: {
      browse(options?: BrowseOptions): Promise<any>;
    };
  }

  export default function GhostContentAPI(options: GhostContentAPIOptions): GhostAPI;
}