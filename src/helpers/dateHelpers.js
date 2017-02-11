export function diffDays(date1, date2) {
  return Math.abs(date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000);
}

export function startOfDay(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  // TODO
  // To actually be on the start of *this* day, we need to be 1ms after its
  // start, this is bug in the react-intl setup
  const d = new Date(year, month, day);
  d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
  return d;
}
