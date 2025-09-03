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
