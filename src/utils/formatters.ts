import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import type { Tournament } from "../types/filter-types"

dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT_HOUR = "DD/MM/YYYY HH:mm"
const DATE_FORMAT = "DD/MM/YYYY"

export const formatUnix = (u: number, dateFormat: string) =>
  dayjs.unix(u).tz("Europe/Paris").format(dateFormat)

export const formatDates = (t: Tournament) =>
  `du ${formatUnix(t.firstDay, DATE_FORMAT)} au ${formatUnix(t.lastDay, DATE_FORMAT)}`

export const formatDisciplines = (t: Tournament) => t.disciplines.join(" / ")

export const formatRanks = (t: Tournament) => `de ${t.minrank} à ${t.maxrank}`

export const formatLink = (t: Tournament) =>
  `https://badnet.fr/tournoi/public?eventid=${t.id}`

export const formatOpenline = (t: Tournament) =>
  formatUnix(t.openline, DATE_FORMAT_HOUR)
