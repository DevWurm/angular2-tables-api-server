// @flow
import type { ElasticsearchConnection } from "../../../database/getESConnection";
import { ISODateToSimpleDateString } from "../../shared/converting";


/**
 * collects dates array from the specified DB dates collection, which match the specified queries
 *
 * @access public
 *
 * @param client {ElasticsearchClient} client which should be used for connections to ES
 * @param index {string} Elasticsearch index, which should be used
 * @param type {string} Elasticsearch type, which should be used
 *
 * @return {Promise} Promise resolved with the Object representation of the requested data or rejected with errors while querying the database
 */
export default function getDatesData({ client, index, type }: ElasticsearchConnection) {
  return client.search({
    index: index,
    type: type,
    size: 0,
    body: {
      "aggs": {
        "dates": {
          "nested": {
            "path": "views"
          },
          "aggs": {
            "dates": {
              "terms": {
                "field": "views.date",
                "size": 0
              }
            }
          }
        }
      }
    }
  }).then(data => data.aggregations.dates.dates.buckets).then(buckets => buckets.map(bucket => bucket.key_as_string)).then(dates => dates.map(ISODateToSimpleDateString));
}