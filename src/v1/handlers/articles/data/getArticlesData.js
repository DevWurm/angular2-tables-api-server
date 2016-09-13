// @flow

import type { QueryParseResult } from "../queries/parsing";
import { ArticleSelection } from "../queries/article-selection/article-selection";
import { SelectionMode } from "../queries/article-selection/selection-mode";
import { SortingSelection } from "../queries/article-sorting/sorting-selection";
import { SortingOrder } from "../../shared/sorting/sorting-order";
import type { ElasticsearchConnection } from "../../../database/getESConnection";
import { ISODateToSimpleDateString } from "../../shared/converting";

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
export default function getArticlesData(queries: QueryParseResult, { client, index, type }: ElasticsearchConnection) {
  // short-circuit request if no elements are requested
  if (queries.count == 0) {
    return Promise.resolve([]);
  } else if (queries.selection.mode == SelectionMode.INCLUDING && queries.selection.ranges.length == 0) {
    return Promise.resolve([]);
  }

  return client.search({
    index: index,
    type: type,
    from: queries.index,
    size: queries.count,
    body: buildDBQuery(queries)
  }).then(data => data.hits.hits).then(hits => hits.map(hit => hit._source)).then(articles => articles.map(article => {
    return {
      article: article.article,
      views: article.views.map(date => {
        return {
          date: ISODateToSimpleDateString(date.date),
          views: date.views
        }
      })
    }
  }));
}

function buildDBQuery(queries): Object {
  const sourceFilter = {
    _source: ['article', "views.*"]
  };

  const filter = (queries.filter) ? buildFilterQuery(queries.filter) : {};
  const selection = buildSelectionQuery(queries.selection);

  const query = {
    query: {
      bool: Object.assign({}, filter, selection)
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

function buildSelectionQuery(selection: ArticleSelection): Object {
  // build filter query, matching all the ranges, if connected with 'must' or 'must_not'
  const ranges = selection.ranges.map(range => {
    return {
      range: {
        exact_article: {
          gte: range.beginning,
          lte: range.end
        }
      }
    }
  });

  if (selection.mode == SelectionMode.EXCLUDING) {
    return {
      filter: {
        bool: {
          must_not: ranges
        }
      }
    }
  } else {
    return {
      filter: {
        bool: {
          must: ranges
        }
      }
    }
  }
}

function buildSortQuery(sorting: SortingSelection): Object {
  const sorts = sorting.sortings.map(sorting => {
    if (sorting.property == "article") {
      return {
        exact_article: sorting.order == SortingOrder.DESC ? "desc" : "asc",
      }
    } else {
      return {
        "views.views": {
          order: sorting.order == SortingOrder.DESC ? "desc" : "asc",
          mode: "max",
          nested_path: "views",
          nested_filter: {
            bool: {
              must: { match: { "views.date": dateFromProperty(sorting.property).toISOString() } }
            }
          }
        }
      }
    }
  });

  return {
    sort: sorts
  };
}

function dateFromProperty(property: string): Date {
  const match = /(\d{4})-(\d{2})-(\d{2})-(\d{2})/.exec(property);
  if (!match) throw new Error("Incorrect date property specified");

  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4])));
}
