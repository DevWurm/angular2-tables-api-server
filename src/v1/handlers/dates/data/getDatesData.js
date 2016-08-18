// @flow

import type { MongoCollection } from "../../../database/getCurrentCollection";

/**
 * collects dates array from the specified DB dates collection, which match the specified queries
 *
 * @access public
 *
 * @param queries {Object} Object containing information about selected ranges and sorting
 * @param col {Collection} MongoDB collection object
 *
 * @return {Promise} Promise resolved with the Object representation of the requested data or rejected with errors while querying the database
 */
export default function getCountData(col: MongoCollection) {
  return new Promise((resolve, reject) => {
    col.findOne({ _id: 'dates' }, { _id: false }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    })
  });
}