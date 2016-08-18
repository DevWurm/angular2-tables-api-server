// @flow

import { SortingOrder } from "../../shared/sorting/sorting-order";
import type { ESortingOrder } from "../../shared/sorting/sorting-order";

export type RequestQuery = {
  sorting?: string,
  index?: string,
  count?: string
}

export type QueryParseResult = {
  sorting: ESortingOrder,
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
  return {
    sorting: query.sorting == '-' ? SortingOrder.DESC : SortingOrder.ASC,
    index: (query.index) ? Number(query.index) : undefined,
    count: (query.count) ? Number(query.count) : undefined
  }
}
