// @flow

import dateFormat from "dateformat";

export function ISODateToSimpleDateString(isoDateString: string): string {
  const date = new Date(isoDateString);

  return dateFormat(date, "UTC:yyyy-mm-dd-HH");
}