// @flow

import {SortingOrder} from "../../../../shared/sorting/sorting-order.enum";

export class Sorting {
  constructor(private _property: string, private _order: SortingOrder) {}

  get property(): string {
    return this._property;
  }

  get order(): SortingOrder {
    return this._order;
  }
}
