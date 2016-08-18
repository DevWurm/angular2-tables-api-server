import { getCurrentDatesCollection } from "../../database/getCurrentCollection";
import getDatesData from "./data/getDatesData";

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
    getCurrentDatesCollection().then(col => {
        return getDatesData(col);
    }).then(data => {
        res.json(data);
        res.end()
    }).catch(reason => {
        next(reason);
    })
}
