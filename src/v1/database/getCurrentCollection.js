import { MongoClient } from "mongodb";

export type MongoCollection = {
  aggregate: Function,
  findOne: Function
}

/**
 * gets a connection to the specified database and collection defined in the environment
 *
 * @access public
 *
 * @return {Promise} Promise resolved with the mongodb collection, specified by the environment or rejected with errors while connecting with the database
 */
export default function getCurrentCollection(): Promise<MongoCollection> {
  const addr = process.env.DB_ADDR || "127.0.0.1";
  const port = process.env.DB_PORT || "27017";

  const db = process.env.DB_DB || "wikipedia"
  const col = process.env.DB_COL || "pagecounts";

  return getCollection(addr, port, db, col);
}

/**
 * gets a connection to the specified database and dates collection defined in the environment
 *
 * @access public
 *
 * @return {Promise} Promise resolved with the mongodb collection, specified by the environment or rejected with errors while connecting with the database
 */
export function getCurrentDatesCollection(): Promise<MongoCollection> {
  const addr = process.env.DB_ADDR || "127.0.0.1";
  const port = process.env.DB_PORT || "27017";

  const db = process.env.DB_DB || "wikipedia"
  const col = process.env.DB_DATES_COL || "pagecounts_dates";

  return getCollection(addr, port, db, col);
}

function getCollection(addr, port, db, col): Promise<MongoCollection> {
   return new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb://${addr}:${port}/${db}`, (err, db) => {
      if (err) return reject(err);

      resolve(db.collection(col));
    })
  });
}