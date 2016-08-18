import {Sorting} from "./sorting";

export class SortingSelection {
  constructor(private _sortings: Array<Sorting>) {}

  get sortings(): Array<Sorting> {
    return this._sortings;
  }
}
