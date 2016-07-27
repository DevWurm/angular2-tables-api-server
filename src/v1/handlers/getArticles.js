import parseRequest from "../queries/articles/parsing";
import getCurrentCollection from "../database/getCurrentCollection";
import getArticlesData from "../data/getArticlesData";

/**
 * Handler for the articles get route
 * Parses the qury and responds with the querried data
 *
 * @access public
 *
 * @param req {Request} Express request object for the current request
 * @param res {Response} Express response object for the current request
 * @param next {Function} Express next middleware function
 */
export default function getArticles (req, res, next) {
    const queries = parseRequest(req);
    
    getCurrentCollection().then(col => {
        return getArticlesData(queries, col);
    }).then(data => {
        res.json(data);
        res.end()
    }).catch(reason => {
        next(reason);
    })
}
