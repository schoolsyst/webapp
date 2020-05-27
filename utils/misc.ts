// Reset time component to 00:00:00
// Useful to do date-wise comparison, w/o taking time into account.
export const removeTime = (date: Date) => {
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  return date
}
