import dayjs from "dayjs"
import type { Filters, Tournament } from "./types/filter-types"

export const filterTournaments = (
  tournaments: Tournament[],
  filters: Filters,
): Tournament[] =>
  tournaments
    .filter(filterPastTournaments)
    .filter((t) => filterOpenTournaments(t, filters))
    .filter((t) => filterClosedTournaments(t, filters))
    .filter((t) => filterAgeCategories(t, filters))

const filterPastTournaments = (t: Tournament): boolean =>
  dayjs.unix(t.lastDay).isAfter(dayjs())

const filterOpenTournaments = (
  t: Tournament,
  { hideOpenedTournaments }: Filters,
): boolean =>
  hideOpenedTournaments ? dayjs.unix(t.openline).isAfter(dayjs()) : true

const filterClosedTournaments = (
  t: Tournament,
  { hideClosedTournaments }: Filters,
): boolean =>
  hideClosedTournaments ? dayjs.unix(t.truedeadline).isAfter(dayjs()) : true

const filterAgeCategories = (t: Tournament, { ageCategories }: Filters) => {
  const validCategories = new Set(ageCategories)
  if (ageCategories.length == 0) return true
  return t.ageCategories.filter((cat) => validCategories.has(cat)).length > 0
}
