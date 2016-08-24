import parseRequest from "./queries/parsing";
import getCountData from "./data/getCountsData";
import { getESConnection } from "../../database/getESConnection";

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
    
    getCountData(queries, getESConnection())
    .then(data => {
        res.json(data);
        res.end()
    }).catch(reason => {
        next(reason);
    })
}
