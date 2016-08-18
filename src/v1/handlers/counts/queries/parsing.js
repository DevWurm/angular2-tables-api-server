// @flow

import Ordering from "../../queries/article-sorting/Ordering";
import SortingProperty from "../../queries/article-sorting/SortingProperty";
import { ArticleRange } from "./counts-selection/article-range";
import { SelectionMode } from "./counts-selection/selection-mode";
import type { ESelectionMode } from "./counts-selection/selection-mode";
import { ArticleSelection } from "./counts-selection/article-selection";

export type RequestQuery = {
  mode?: string,
  range?: [{from: string, to: string}],
  sort?: string,
  index?: string,
  count?: string
}

export type QueryParseResult = {
  sorting: [any],
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

  result.sorting = (query.sort) ? parseSorting(query.sort) : [];

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
function parseSorting(query: string) {
  return query.split(',').filter(entry => entry !== "").map(prop => {
    const matchResult = /([+-]?)([\w-]+):?([\w\d-]+)?/.exec(prop);

    if (!matchResult) throw new Error("Can't parse sorting query: Incorrect query String");

    const result = {};
    switch (matchResult[2]) {
      case "article":
        result.property = SortingProperty.ARTICLE;
        break;
      case "count-date":
        if (!matchResult[3]) throw new Error("Can't parse sorting query: No option for count-date sorting provided");
        result.property = SortingProperty.COUNT_DATE;
        try {
          result.date = matchResult[3];
        } catch (e) {
          throw new Error("Can't parse sorting query: Incorrect date option for count-date sorting");
        }
        break;
      default:
        throw new Error("Can't parse sorting query: Incorrect sorting specified");
    }

    result.ordering = (matchResult[1] == "-") ? Ordering.DESC : Ordering.ASC;

    return result;
  })
}
