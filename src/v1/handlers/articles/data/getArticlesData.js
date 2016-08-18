// @flow

import type { QueryParseResult } from "./queries/parsing";
import type { MongoCollection } from "../../../database/getCurrentCollection";
import { SortingOrder } from "../../../../../lib/v1/handlers/shared/sorting/sorting-order";

/**
 * collects all articles from the specified DB collection, which match the specified queries
 *
 * @access public
 *
 * @param queries {Object} Object containing information about selected ranges and sorting
 * @param col {Collection} MongoDB collection object
 *
 * @return {Promise} Promise resolved with the Object representation of the requested data or rejected with errors while querying the database
 */
export default function getArticlesData(queries: QueryParseResult, col: MongoCollection) {
  // short-circuit request if no elements are requested
  if (queries.count == 0) {
    return Promise.resolve({});
  }

  return new Promise((resolve, reject) => {
    col.aggregate(buildDBQuery(queries), (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function buildDBQuery(queries): [Object] {
  let resultQuery = [];

  // add sort query to result query
  resultQuery.push(buildSortQuery(queries.sorting));

  // add project query to result query
  resultQuery.push(buildProjectQuery());

  // add skip query to result query
  if (queries.index) {
    resultQuery.push({
      $skip: Number(queries.index)
    })
  }

  // add limit query to result query
  if (queries.count) {
    resultQuery.push({
      $limit: Number(queries.count)
    })
  }

  return resultQuery;
}

function buildSortQuery(sortingQuery): Object {
  return {
    $sort: {
      article: sortingQuery == SortingOrder.DESC ? -1 : 1
    }
  }
}

function buildProjectQuery(): Object {
  return {
    $project: {
      article: 1
    }
  };
}