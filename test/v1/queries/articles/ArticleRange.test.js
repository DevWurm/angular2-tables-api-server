import ArticleRange from "../../../../src/v1/queries/articles/ArticleRange";
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

        assert.doesNotThrow(() => {new ArticleRange(from, to, excludes)});

        const range = new ArticleRange(from, to, excludes);

        assert.equal(range.from, from)
        assert.equal(range.to, to)
        assert.isTrue(range.excludes.has("d"));
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
})
