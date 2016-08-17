// @flow

import {ArticleRange} from "./article-range";
import type {ESelectionMode} from "./selection-mode";

/**
 * Class which describes a selection of articles in an including or excluding manner
 */
export class ArticleSelection {
  _ranges: Array<ArticleRange>;
  _mode: ESelectionMode;

  constructor(ranges: Array<ArticleRange>, mode: ESelectionMode) {
    this._ranges = ranges;
    this._mode = mode;
  }

  get ranges(): Array<ArticleRange> {
    return this._ranges;
  }

  get mode(): ESelectionMode {
    return this._mode;
  }
}
