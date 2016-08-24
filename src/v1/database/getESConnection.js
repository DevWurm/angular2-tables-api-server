// @flow

import { Client } from "elasticsearch";

export type ElasticsearchConnection = {
  client: ElasticsearchClient,
  index: string,
  type: string
}

export type ElasticsearchClient = {
  search: Function
}

export function getESConnection(): ElasticsearchConnection {
  const addr = process.env.DB_ADDR || "127.0.0.1";
  const port = process.env.DB_PORT || "9200";

  const index = process.env.DB_INDEX || "pagecounts"
  const type = process.env.DB_TYPE || "article";

  return {
    client: new Client({host: `${addr}:${port}`}),
    index,
    type
  }
}