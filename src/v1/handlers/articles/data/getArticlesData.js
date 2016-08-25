// @flow

import type { QueryParseResult } from "../queries/parsing";
import { SortingOrder } from "../../../../../lib/v1/handlers/shared/sorting/sorting-order";
import type { ElasticsearchConnection } from "../../../database/getESConnection";


/**
 * collects all articles from the specified DB, which match the specified queries
 *
 * @access public
 *
 * @param queries {Object} Object containing information about selected ranges and sorting
 *
 * @param client {ElasticsearchClient} client which should be used for connections to ES
 * @param index {string} Elasticsearch index, which should be used
 * @param type {string} Elasticsearch type, which should be used
 *
 * @return {Promise} Promise resolved with the Object representation of the requested data or rejected with errors while querying the database
 */
export default function getCountData(queries: QueryParseResult, { client, index, type }: ElasticsearchConnection) {
  // short-circuit request if no elements are requested
  if (queries.count == 0) {
    return Promise.resolve({});
  }

  return client.search({
    index: index,
    type: type,
    from: queries.index,
    size: queries.count,
    body: buildDBQuery(queries)
  }).then(data => data.hits.hits).then(hits => hits.map(hit => hit._source));
}

function buildDBQuery(queries): Object {
  const sourceFilter = {
    _source: ['article']
  };

  const filter = (queries.filter) ? buildFilterQuery(queries.filter) : {};

  const query = {
    query: {
      bool: Object.assign({}, filter)
    }
  };

  const sort = buildSortQuery(queries.sorting);

  return Object.assign({}, sourceFilter, query, sort);
}

function buildFilterQuery(filterQuery: string): Object {
  return {
    must: {
      match: {
        article: filterQuery
      }
    }
  }
}

function buildSortQuery(sortingQuery): Object {
  return {
    sort: [
      {exact_article: sortingQuery == SortingOrder.DESC ? "desc" : "asc"}
    ]
  }
}
