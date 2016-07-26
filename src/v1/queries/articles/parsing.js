import Ordering from "./Ordering";
import ArticleRange from "./ArticleRange";

/**
 * parses the query information for a request object to the 'articles' API endpoint
 *
 * @access public
 *
 * @param req {Request} Express request object
 *
 * @return {Object} object containing the requested ranges in the ranges property and the requested sorting in the sorting property
 */
export default function parseRequest(req) {
    const result = {};

    result.sorting = (req.query.sort) ? parseSorting(req.query.sort) : [];

    const excludes = (req.query.exclude) ? parseExcludes(req.query.exclude) : [];
    result.ranges = (req.query.range) ? parseRanges(req.query.range, excludes) : [new ArticleRange(null, null, excludes, true)];

    return result;
}


/**
 * parses range query Object / array
 *
 * @access public
 *
 * @param query {Object / [Object]} Object if only one range specified, otherwise array of query objects
 * @param excludes {[String]} Array of excluded articles
 *
 * @return {[ArticleRange]} Array of ArticleRange objects
 */
export function parseRanges(query, excludes) {
    const queryRanges = (query instanceof Array) ? query : [query];

    const articleRanges =  queryRanges.map(range => new ArticleRange(range.from, range.to, excludes.filter(article => article > range.from && article < range.to)));

    // merge all article Ranges, which are overlapping
    return articleRanges.reduce((acc, range) => {
        if (acc.filter(range.isOverlapping.bind(range)).length !== 0) {
            return acc.map(accRange => (range.isOverlapping(accRange)) ? range.merge(accRange) : accRange);
        } else {
            return acc.concat(range);
        }
    }, [])
}

/**
 * parses 'exclude' query string
 *
 * @access public
 *
 * @param query {String} 'exclude' query String
 *
 * @return {[String]} array of Strings containing the excluded articles
 */
export function parseExcludes(query) {
    return query.split(',').filter(entry => entry !== "");
}


/**
 * parses 'sort' query string into a object representation
 *
 * @access private
 *
 * @param query {String} 'sort' query String
 *
 * @return {Array} array of objects containing sorting property name and Ordering enum value (ASC, DESC)
 */
export function parseSorting(query) {
    return query.split(',').filter(entry => entry !== "").map(prop => {
        const matchResult = /([\+\-]{0,1})([\w\d]+)/.exec(prop);

        if (!matchResult) throw new Error("Can't parse sorting query: Incorrect query String");

        return {
            property: matchResult[2],
            ordering: (matchResult[1] === "-") ? Ordering.DESC : Ordering.ASC
        };
    })
}
