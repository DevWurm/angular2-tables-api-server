/**
 * data class for storing information about requested article ranges
 *
 * @access public
 */
export default class ArticleRange {
    constructor(from, to, excludes) {
        if (excludes.includes(from) || excludes.includes(to)) throw new Error("Can't create ArticleRange: borders mustn't be excluded");
        this.from = from;
        this.to = to;
        excludes.forEach(exclude => {if (exclude < this.from || exclude > this.to) throw new Error("Can't create ArticleRange: excludes not in range");})
        this.excludes = new Set(excludes);
    }

    isInside(article) {
        return (article >= this.from && article <= this.to && !this.excludes.has(article));
    }

    isOverlapping(range) {
        return (!(range.to < this.from) && !(range.from > this.to));
    }

    merge(range) {
        if (!this.isOverlapping(range)) throw new Error("Can't merge ranges: Not overlapping");
        const from = (this.from < range.from) ? this.from : range.from;
        const to = (this.to > range.to) ? this.to : range.to;
        const excludes = this.excludes;
        for (const elem of range.excludes) excludes.add(elem);

        return new ArticleRange(from, to, Array.from(excludes));
    }
}
