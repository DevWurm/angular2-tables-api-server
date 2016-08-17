import parseRequest from "./queries/parsing";
import getCurrentCollection from "../database/getCurrentCollection";
import getCountData from "./data/getCountData";

/**
 * Handler for the counts get route
 * Parses the qury and responds with the querried data
 *
 * @access public
 *
 * @param req {Request} Express request object for the current request
 * @param res {Response} Express response object for the current request
 * @param next {Function} Express next middleware function
 */
export default function getCounts (req, res, next) {
    const queries = parseRequest(req.query);
    
    getCurrentCollection().then(col => {
        return getCountData(queries, col);
    }).then(data => {
        res.json(data);
        res.end()
    }).catch(reason => {
        next(reason);
    })
}
