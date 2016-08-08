import SortingProperty from "../queries/counts/SortingProperty";

/**
 * collects all counts from the specified DB collection, which match the specified queries
 *
 * @access public
 *
 * @param queries {Object} Object containing information about selected ranges and sorting
 * @param col {Collection} MongoDB collection object
 *
 * @return {Promise} Promise resolved with the Object representation of the requested data or rejected with errors while querying the database
 */
export default function getCountData(queries, col) {
    return new Promise((resolve, reject) => {
        col.aggregate(buildDBQuery(queries), (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

function buildDBQuery(queries) {
    let resultQuery = [];
    
    // add match query to result query
    resultQuery.push(buildMatchQuery(queries.ranges));

    // add sort query to result query
    resultQuery.push(buildSortQuery(queries.sorting));

    // add skip query to result query
    if (queries.index) {
        resultQuery.push({
            $skip: Number(queries.index)
        })
    }

    // add limit query to result query
    if (queries.count) {
        resultQuery.push({
            $limit: Number(queries.count)
        })
    }

    return resultQuery;
}

function buildMatchQuery(queryRanges) {
    // build filter query, matching all the ranges, if connected with 'or'
    const ranges = queryRanges.map(range => {
        if (range.all) {
            return {};
        } else {
            return {
                $and: [
                    {article: {$gte: range.from}},
                    {article: {$lte: range.to}}
                ]
            };
        }
    })

    // get all exclusions
    const excludes = queryRanges.map(range => Array.from(range.excludes)).reduce((acc, arr) => acc.concat(arr), []);
    
    const matchQuery = {
        $match: { 
            $and: [
                {$or: ranges},
                {article: {$not: {$in: excludes}}}
            ]
        }
    }

    return matchQuery;
}

function buildSortQuery(querySorting) {
    // get sorting rules and build query object which sorts correctls, when used by the $sort operator
    const sorts = (querySorting.length < 1) ? {article: 1} : querySorting.map(sortOption => {
        const result = {};
        if (sortOption.property == SortingProperty.COUNT_DATE) {
            result[sortOption.date] = sortOption.ordering;
        } else {
            result["article"] = sortOption.ordering;
        }

        return result;
    }).reduce((acc, sortOption) => {
        for (const key of sortOption.keys()) {
            acc[key] = sortOption[key];
        }
        return acc;
    }, {});

    const sortQuery = {
        $sort: sorts
    };

    return sortQuery;
}
