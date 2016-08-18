// @flow

import { ArticleRange } from "./counts-selection/article-range";
import { SelectionMode } from "./counts-selection/selection-mode";
import type { ESelectionMode } from "./counts-selection/selection-mode";
import { ArticleSelection } from "./counts-selection/article-selection";
import { SortingSelection } from "./counts-sorting/sorting-selection";
import { Sorting } from "./counts-sorting/sorting";
import { SortingOrder } from "../../shared/sorting/sorting-order";

export type RequestQuery = {
  mode?: string,
  range?: [{from: string, to: string}],
  sorting?: [string],
  index?: string,
  count?: string
}

export type QueryParseResult = {
  sorting: SortingSelection,
  selection: ArticleSelection,
  index?: number,
  count?: number
}
/**
 * parses the query information for a request object to the 'counts' API endpoint
 *
 * @access public
 *
 * @param query {RequestQuery} Express request query object
 *
 * @return {Object} object containing the requested ranges in the ranges property and the requested sorting in the sorting property
 */
export default function parseRequest(query: RequestQuery): QueryParseResult {
  const result = {};

  result.sorting = (query.sorting) ? parseSorting(query.sorting) : new SortingSelection([]);

  let ranges = (query.range) ? parseRanges(query.range) : [];
  let mode = (query.mode) ? parseMode(query.mode) : SelectionMode.EXCLUDING;
  result.selection = new ArticleSelection(ranges, mode);

  result.index = (query.index) ? Number(query.index) : undefined;
  result.count = (query.count) ? Number(query.count) : undefined;

  return result;
}


/**
 * parses range query array
 *
 * @access private
 *
 * @param query {[Object]} array of query objects
 *
 * @return {[ArticleRange]} Array of ArticleRange objects
 */
function parseRanges(query: [{from: string, to: string}]) {
  return query.map(range => new ArticleRange(range.from, range.to));
}

/**
 * parses a mode query string into the corresponding SelectionMode Enum value
 *
 * @access private
 *
 * @param query {String} query which specifies the the mode of the request regarding include or exclude semantics
 *
 * @return {ESelectionMode} SelectionMode enum value describing the requested mode (EXCLUDING if parsing is not successful)
 */
function parseMode(query: string): ESelectionMode {
  switch (query) {
    case 'including':
      return SelectionMode.INCLUDING;
    default:
      return SelectionMode.EXCLUDING;
  }
}

/**
 * parses 'sort' query string into a object representation
 *
 * @access private
 *
 * @param query {String} 'sort' query String
 *
 * @return {Array} array of objects containing SortingProperty enum value and Ordering enum value (ASC, DESC)
 */
function parseSorting(query: [string]) {
  let sortings = query.map(sortingStr => {
    let match = /([+-]?)([\w\d-]+)/.exec(sortingStr);

    if (!match) throw new Error("Incorrect sorting definition");

    return new Sorting(match[2], match[1] == '-' ? SortingOrder.DESC : SortingOrder.ASC);
  })

  return new SortingSelection(sortings);
}
