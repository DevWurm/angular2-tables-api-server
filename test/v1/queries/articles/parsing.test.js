import parseRequest, {parseRanges, parseExcludes, parseSorting} from "../../../../src/v1/queries/counts/parsing";
import ArticleRange from "../../../../src/v1/queries/counts/ArticleRange";
import Ordering from "../../../../src/v1/queries/counts/Ordering";
import {assert} from "chai";
import SortingProperty from "../../../../src/v1/queries/counts/SortingProperty";

suite("parsing", function() {
    suite("parseRanges", function() {
        test("single range", function() {
            const queryObject = {from: "a", to: "f"};
            const excludes = ["c"];

            const ranges = parseRanges(queryObject, excludes);

            assert.equal(ranges[0].from, "a")
            assert.equal(ranges[0].to, "f")
            assert.isTrue(ranges[0].excludes.has("c"))
        })

        test("multiple ranges", function() {
            const queryArray = [
                {from: "a", to: "d"},
                {from: "f", to: "h"}
            ];
            const excludes = ["c", "g"];

            const ranges = parseRanges(queryArray, excludes);

            assert.equal(ranges.length, 2)
            
            assert.equal(ranges[0].from, "a")
            assert.equal(ranges[0].to, "d")
            assert.isTrue(ranges[0].excludes.has("c"))

            assert.equal(ranges[1].from, "f")
            assert.equal(ranges[1].to, "h")
            assert.isTrue(ranges[1].excludes.has("g"))
        })

        test("multiple ranges which are overlapping", function() {
            const queryArray = [
                {from: "a", to: "d"},
                {from: "q", to: "z"},
                {from: "c", to: "h"}
            ];
            const excludes = ["c", "g", "y"];

            const ranges = parseRanges(queryArray, excludes);

            assert.equal(ranges.length, 2)
            
            assert.equal(ranges[0].from, "a")
            assert.equal(ranges[0].to, "h")
            assert.isTrue(ranges[0].excludes.has("c"))
            assert.isTrue(ranges[0].excludes.has("g"))
            assert.isFalse(ranges[0].excludes.has("y"))

            assert.equal(ranges[1].from, "q")
            assert.equal(ranges[1].to, "z")
            assert.isTrue(ranges[1].excludes.has("y"))
            assert.isFalse(ranges[1].excludes.has("c"))
            assert.isFalse(ranges[1].excludes.has("g"))
        })
    })

    suite("parseExcludes", function() {
        test("parse excludes query correctly", function() {
            const query = "a,g,j";

            assert.deepEqual(parseExcludes(query), ["a","g","j"])
        })

        test("parse excludes query with single entry correctly", function() {
            const query = "a";

            assert.deepEqual(parseExcludes(query), ["a"])
        })

        test("parse empty excludes query correctly", function() {
             const query = "";

             assert.deepEqual(parseExcludes(query), [])
        })
    })

    suite("parseSorting", function() {
        test("parse single ascending sort query", function() {
            const query = "+article";
            const query2 = "article";

            assert.deepEqual(parseSorting(query), [{property: SortingProperty.ARTICLE, ordering: Ordering.ASC}])
            assert.deepEqual(parseSorting(query2), [{property: SortingProperty.ARTICLE, ordering: Ordering.ASC}])
        })

        test("parse single descending sort query", function() {
            const query = "-article";

            assert.deepEqual(parseSorting(query), [{property: SortingProperty.ARTICLE, ordering: Ordering.DESC}])
        })

        test("parse multiple property sort query", function() {
            const query = "-article,count-date:2016-07-01-01,+count-date:2016-07-01-02";

            assert.deepEqual(parseSorting(query), [{property: SortingProperty.ARTICLE, ordering: Ordering.DESC}, {property: SortingProperty.COUNT_DATE, ordering: Ordering.ASC, date: '2016-07-01-01'}, {property: SortingProperty.COUNT_DATE, ordering: Ordering.ASC, date: '2016-07-01-02'}])
        })

        test("correct result on empty query string", function() {
            const query = "";

            assert.deepEqual(parseSorting(query), []);
        })

        test("correct error on incorrect query string", function() {
            const query = "$%&/(";

            assert.throws(() => {parseSorting(query)}, /Can't parse sorting query: Incorrect query String/);
        })
    })

    suite("parseRequest", function() {
        test("parse request containing only sorting", function() {
            const req = {
                query: {
                    sort: "-article,count-date:2016-07-01-01"
                }
            }

            assert.deepEqual(parseRequest(req), {index: undefined, count: undefined, ranges: [new ArticleRange(null, null, [], true)], sorting: [{property: SortingProperty.ARTICLE, ordering: Ordering.DESC}, {property: SortingProperty.COUNT_DATE, ordering: Ordering.ASC, date: '2016-07-01-01'}]})
        })

        test("parse request containing only ranges", function() {
            const req = {
                query: {
                    range: {
                        from: "a",
                        to: "b"
                    }
                }
            }

            assert.deepEqual(parseRequest(req), {index: undefined, count: undefined,ranges: [new ArticleRange("a", "b", [])], sorting: []})
        })

        test("parse request containing only excludes", function() {
            const req = {
                query: {
                    exclude: "b,d"
                }
            }

            assert.deepEqual(parseRequest(req), {index: undefined, count: undefined,ranges: [new ArticleRange(null, null, ["b", "d"], true)], sorting: []})
        })

    })
})
