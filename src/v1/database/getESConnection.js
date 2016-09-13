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
  const addr = process.env.ES_ADDR || "localhost";
  const port = process.env.ES_PORT || "9200";

  const index = process.env.ES_INDEX || "pageviews";
  const type = process.env.ES_TYPE || "article";

  return {
    client: new Client({host: `${addr}:${port}`}),
    index,
    type
  }
}