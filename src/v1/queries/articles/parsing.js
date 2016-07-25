import Ordering from "./Ordering";
import ArticleRange from "./ArticleRange";

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
    if (!query) return [];
    return query.split(',')
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
export function parseSortQuery(query) {
    return query.split(',').map(prop => {
        const matchResult = /([\+\-]{0,1})([\w\d]+)/.exec(prop);

        if (!matchResult) throw new Error("Can't parse sorting property: Incorrect property String");

        return {
            property: matchResult[2],
            ordering: (matchResult[1] === "-") ? Ordering.DESC : Ordering.ASC
        };
    })
}
