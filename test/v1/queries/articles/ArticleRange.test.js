import ArticleRange from "../../../../src/v1/queries/counts/ArticleRange";
import {assert} from "chai";

suite("ArticleRange", function() {
    test("Correct errors on invalid construction", function() {
        const from = "c";
        const to = "f";

        const incorrectExcludes1 = ["c","d"];
        const incorrectExcludes2 = ["e","f"];
        const incorrectExcludes3 = ["a"];
        const incorrectExcludes4 = ["g"];

        assert.throws(() => {new ArticleRange(from, to, incorrectExcludes1)}, /Can't create ArticleRange: borders mustn't be excluded/);
        assert.throws(() => {new ArticleRange(from, to, incorrectExcludes2)}, /Can't create ArticleRange: borders mustn't be excluded/);
        assert.throws(() => {new ArticleRange(from, to, incorrectExcludes3)}, /Can't create ArticleRange: excludes not in range/);
        assert.throws(() => {new ArticleRange(from, to, incorrectExcludes4)}, /Can't create ArticleRange: excludes not in range/);
    })

    test("Correct construction", function() {
        const from ="c";
        const to = "f";

        const excludes = ["d"];
        const excludes2 = ["a"];

        assert.doesNotThrow(() => {new ArticleRange(from, to, excludes)});
        assert.doesNotThrow(() => {new ArticleRange(from, to, excludes2, true)});

        const range = new ArticleRange(from, to, excludes);
        const range2 = new ArticleRange(from, to, excludes, true);

        assert.equal(range.from, from)
        assert.equal(range.to, to)
        assert.isTrue(range.excludes.has("d"));
        assert.isFalse(range.all)

        assert.equal(range2.from, undefined)
        assert.equal(range2.to, undefined)
        assert.isTrue(range2.excludes.has("d"))
        assert.isTrue(range2.all)
    })

    test("isInside", function() {
        const from ="c";
        const to = "f";

        const excludes = ["d"];

        const range = new ArticleRange(from, to, excludes);

        assert.isTrue(range.isInside("c"));
        assert.isTrue(range.isInside("f"));
        assert.isTrue(range.isInside("e"));
        assert.isFalse(range.isInside("d"));
    })

    test("isOverlapping", function() {
        const from ="c";
        const to = "f";

        const excludes = ["d"];

        const range = new ArticleRange(from, to, excludes);

        const from2 = "e";
        const to2 = "h";

        const range2 = new ArticleRange(from2, to2, []);

        const from3 = "a";
        const to3 = "e";

        const range3 = new ArticleRange(from3, to3, []);


        const from4 = "a";
        const to4 = "b";

        const range4 = new ArticleRange(from4, to4, []);

        const from5 = "e";
        const to5 = "f";

        const range5 = new ArticleRange(from5, to5, []);

        assert.isTrue(range.isOverlapping(range2))
        assert.isTrue(range.isOverlapping(range3))
        assert.isTrue(range.isOverlapping(range5))
        assert.isFalse(range.isOverlapping(range4))
    })

    test("isOverlapping with 'all' ranges", function() {
        const allRange = new ArticleRange(null, null, [], true);
        const allRange2 = new ArticleRange(null, null, [], true);
        const regularRange = new ArticleRange("a", "c", []);

        assert.isTrue(allRange.isOverlapping(allRange2))
        assert.isTrue(allRange.isOverlapping(regularRange))
        assert.isTrue(regularRange.isOverlapping(allRange))
    })

    test("Errors on incorrect merge", function() {
        const from ="c";
        const to = "f";

        const excludes = ["d"];

        const range = new ArticleRange(from, to, excludes);

        const from2 = "h";
        const to2 = "j";

        const range2 = new ArticleRange(from2, to2, []);

        assert.throws(() => {range.merge(range2)}, /Can't merge ranges: Not overlapping/)
    })

    test("merge", function() {
        const from ="c";
        const to = "f";

        const excludes = ["d"];

        const range = new ArticleRange(from, to, excludes);

        const from2 = "e";
        const to2 = "j";

        const excludes2 = ["i"];

        const range2 = new ArticleRange(from2, to2, excludes2);

        assert.doesNotThrow(() => {range.merge(range2)})

        const mergedRange = range.merge(range2);

        assert.equal(mergedRange.from, "c")
        assert.equal(mergedRange.to, "j")
        assert.isTrue(mergedRange.excludes.has("d"))
        assert.isTrue(mergedRange.excludes.has("i"), "Merged mergedRange should include excludes from other range")
    })

    test("merge with all ranges", function() {
        const allRange = new ArticleRange(null, null, [], true);
        const allRange2 = new ArticleRange(null, null, [], true);
        const regularRange = new ArticleRange("a", "c", ["b"]);

        const mergedRange = allRange.merge(allRange2);
        const mergedRange2 = allRange.merge(regularRange);

        assert.equal(mergedRange.from, undefined)
        assert.equal(mergedRange.to, undefined)
        assert.isTrue(mergedRange.all)

        assert.equal(mergedRange2.from, undefined)
        assert.equal(mergedRange2.to, undefined)
        assert.isTrue(mergedRange2.excludes.has("b"))
        assert.isTrue(mergedRange2.all)
    })
})
