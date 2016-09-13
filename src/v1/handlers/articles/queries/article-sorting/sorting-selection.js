import {Sorting} from "./sorting";

export class SortingSelection {
  _sortings: Array<Sorting>;

  constructor(sortings: Array<Sorting>) {
    this._sortings = sortings;
  }

  get sortings(): Array<Sorting> {
    return this._sortings;
  }
}
