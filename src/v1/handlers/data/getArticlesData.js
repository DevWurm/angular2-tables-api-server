// @flow

import SortingProperty from "../queries/article-sorting/SortingProperty";
import type { QueryParseResult } from "../queries/parsing";
import type { MongoCollection } from "../../database/getCurrentCollection";
import { ArticleSelection } from "../queries/article-selection/article-selection";
import { SelectionMode } from "../queries/article-selection/selection-mode";

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
export default function getCountData(queries: QueryParseResult, col: MongoCollection) {
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

function buildSortQuery(querySorting): Object {
  // get sorting rules and build query object which sorts correctls, when used by the $sort operator
  const sorts = (querySorting.length < 1) ? { article: 1 } : querySorting.map(sortOption => {
    const result = {};
    if (sortOption.property == SortingProperty.COUNT_DATE) {
      result[sortOption.date] = sortOption.ordering;
    } else {
      result["article"] = sortOption.ordering;
    }

    return result;
  }).reduce((acc, sortOption) => {
    for (const key of sortOption.keys()) {
      acc[key] = sortOption[key];
    }
    return acc;
  }, {});

  const sortQuery = {
    $sort: sorts
  };

  return sortQuery;
}
