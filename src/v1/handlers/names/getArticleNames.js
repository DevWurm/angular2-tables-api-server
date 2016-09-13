import parseRequest from "./queries/parsing";
import getArticleNameData from "./data/getArticleNameData";
import { getESConnection } from "../../database/getESConnection";

/**
 * Handler for the articles get route
 * Parses the query and responds with the queried data
 *
 * @access public
 *
 * @param req {Request} Express request object for the current request
 * @param res {Response} Express response object for the current request
 * @param next {Function} Express next middleware function
 */
export default function getArticleNames (req, res, next) {
    const queries = parseRequest(req.query);

    getArticleNameData(queries, getESConnection())
      .then(data => {
          res.json(data);
          res.end()
      }).catch(reason => {
        next(reason);
    })
}
