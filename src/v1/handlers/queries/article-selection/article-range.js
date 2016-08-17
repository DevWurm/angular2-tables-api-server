// @flow

/**
 * Class which describes a lexical range of articles
 */
export class ArticleRange {
  _beginning: string;
  _end: string;

  constructor(beginning: string, end: string) {
    if (beginning > end) throw new Error("Beginning of range mustn't be lexically bigger than end of range");

    this._beginning = beginning;
    this._end = end;
  }


  get beginning(): string {
    return this._beginning;
  }

  get end(): string {
    return this._end;
  }
}
