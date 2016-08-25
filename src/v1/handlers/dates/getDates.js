import { getCurrentDatesCollection } from "../../database/getCurrentCollection";
import getDatesData from "./data/getDatesData";
import { getESConnection } from "../../database/getESConnection";

/**
 * Handler for the dates get route
 *
 * @access public
 *
 * @param req {Request} Express request object for the current request
 * @param res {Response} Express response object for the current request
 * @param next {Function} Express next middleware function
 */
export default function getDates (req, res, next) {
    getDatesData(getESConnection())
      .then(data => {
          res.json(data);
          res.end()
      }).catch(reason => {
        next(reason);
    })
}
