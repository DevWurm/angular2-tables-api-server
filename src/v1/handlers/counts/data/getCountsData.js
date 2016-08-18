// @flow

import SortingProperty from "../../queries/article-sorting/SortingProperty";
import type { QueryParseResult } from "../queries/parsing";
import type { MongoCollection } from "../../../database/getCurrentCollection";
import { ArticleSelection } from "../queries/counts-selection/article-selection";
import { SelectionMode } from "../queries/counts-selection/selection-mode";
import { SortingSelection } from "../queries/counts-sorting/sorting-selection";
import { SortingOrder } from "../../shared/sorting/sorting-order";

/**
 * collects all counts from the specified DB collection, which match the specified queries
 *
 * @access public
 *
 * @param queries {Object} Object containing information about selected ranges and sorting
 * @param col {Collection} MongoDB collection object
 *
 * @return {Promise} Promise resolved with the Object representation of the requested data or rejected with errors while querying the database
 */
export default function getCountData(queries: QueryParseResult, col: MongoCollection) {
  return new Promise((resolve, reject) => {
    col.aggregate(buildDBQuery(queries), (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function buildDBQuery(queries): [Object] {
  let resultQuery = [];

  // add match query to result query
  resultQuery.push(buildMatchQuery(queries.selection));

  // add sort query to result query
  resultQuery.push(buildSortQuery(queries.sorting));

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

function buildMatchQuery(selection: ArticleSelection): Object {
  // build filter query, matching all the ranges, if connected with 'or'
  const ranges = selection.ranges.map(range => {
    return {
      $and: [
        { article: { $gte: range.beginning } },
        { article: { $lte: range.end } }
      ]
    }
  });

  if (selection.mode == SelectionMode.EXCLUDING) {
    return {
      $match: (ranges.length > 0) ? { $nor: ranges } : {}
    }
  } else {
    return {
      $match: (ranges.length > 0) ? { $or: ranges } : {article: null}
    }
  }
}

function buildSortQuery(sorting: SortingSelection): Object {
  // get sorting rules and build query object which sorts corrects, when used by the $sort operator
  const sorts = sorting.sortings.map(sorting => {
    return {[sorting.property]: sorting.order == SortingOrder.DESC ? -1 : 1};
  }).reduce((prev, curr) => Object.assign(prev, curr), {});

  return {
    $sort: sorts
  };
}
