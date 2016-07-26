import parseRequest, {parseRanges, parseExcludes, parseSorting} from "../../../../src/v1/queries/articles/parsing";
import ArticleRange from "../../../../src/v1/queries/articles/ArticleRange";
import Ordering from "../../../../src/v1/queries/articles/Ordering";
import {assert} from "chai";

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
            const query = "+test";
            const query2 = "test";

            assert.deepEqual(parseSorting(query), [{property: "test", ordering: Ordering.ASC}])
            assert.deepEqual(parseSorting(query2), [{property: "test", ordering: Ordering.ASC}])
        })

        test("parse single descending sort query", function() {
            const query = "-test";

            assert.deepEqual(parseSorting(query), [{property: "test", ordering: Ordering.DESC}])
        })

        test("parse multiple property sort query", function() {
            const query = "-test,test2,+test3";

            assert.deepEqual(parseSorting(query), [{property: "test", ordering: Ordering.DESC}, {property: "test2", ordering: Ordering.ASC}, {property: "test3", ordering: Ordering.ASC}])
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
                    sort: "-test,test2"
                }
            }

            assert.deepEqual(parseRequest(req), {ranges: [new ArticleRange(null, null, [], true)], sorting: [{property: "test", ordering: Ordering.DESC}, {property: "test2", ordering: Ordering.ASC}]})
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

            assert.deepEqual(parseRequest(req), {ranges: [new ArticleRange("a", "b", [])], sorting: []})
        })

        test("parse request containing only excludes", function() {
            const req = {
                query: {
                    exclude: "b,d"
                }
            }

            assert.deepEqual(parseRequest(req), {ranges: [new ArticleRange(null, null, ["b", "d"], true)], sorting: []})
        })

    })
})
