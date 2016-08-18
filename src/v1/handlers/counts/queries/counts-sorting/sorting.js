// @flow

import type { ESortingOrder } from "../../../shared/sorting/sorting-order";


export class Sorting {
  _property: string;
  _order: ESortingOrder;

  constructor(property: string, order: ESortingOrder) {
    this._order = order;
    this._property = property;
  }

  get property(): string {
    return this._property;
  }

  get order(): ESortingOrder {
    return this._order;
  }
}
