import axios from "axios"
import { BADNETORIGIN, BADNETTOKEN, PAGELIMIT } from "./env"
import type { Filters, Tournament } from "./types/filter-types"
import type { BadnetTournament } from "./types/payload-types"

const RANKINGS: Record<string, number> = {
  N1: 1,
  N2: 2,
  N3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  D7: 7,
  D8: 8,
  D9: 9,
  P10: 10,
  P11: 11,
  P12: 12,
  NC: 13,
}

export const mapToTournaments = (data: string, region?: string): Tournament[] => {
  const parsed: { events: BadnetTournament[] } = JSON.parse(data)
  return parsed.events.map((event: BadnetTournament) => ({
    id: event.id,
    name: event.name,
    openline: event.openline,
    truedeadline: event.truedeadline,
    ageCategories: event.catages.map((c) => c.name),
    disciplines: event.disciplines.map((d) => d.stamp),
    firstDay: event.firstday,
    lastDay: event.lastday,
    location: event.place.location,
    type: {
      id: event.type.id,
      isteam: event.type.isteam,
      name: event.type.name,
    },
    minrank: event.draws
      .map((d) => ({
        name: d.minranking.name,
        value: RANKINGS[d.minranking.name],
      }))
      .sort((a, b) => b.value - a.value)[0].name,
    maxrank: event.draws
      .map((d) => ({
        name: d.maxranking.name,
        value: RANKINGS[d.maxranking.name],
      }))
      .sort((a, b) => a.value - b.value)[0].name,
    region,
  }))
}

export const fetchTournaments = async (
  filters: Filters,
): Promise<Tournament[]> => {
  let offset = 0
  let allTournaments: Tournament[] = []
  console.log(`Fetching with limit : ${PAGELIMIT}`)

  while (true) {
    const response = await axios.get<Tournament[]>(
      process.env.BADNET_API_URL as string,
      {
        headers: {
          "x-badnet-origin": BADNETORIGIN,
          "x-badnet-token": BADNETTOKEN,
        },
        params: {
          iswithpast: false,
          ligue: filters.region,
          limit: PAGELIMIT,
          offset,
          type: "70",
          what: filters.search,
        },
        transformResponse: (data) => mapToTournaments(data, filters.region),
      },
    )

    const tournaments = response.data
    if (!tournaments.length) break

    allTournaments = allTournaments.concat(tournaments)

    offset += PAGELIMIT
  }

  return allTournaments
}

export const fetchTournamentsForRegions = async (
  filters: Filters,
  regions: string[],
): Promise<Tournament[]> => {
  const promises = regions.map(region => 
    fetchTournaments({ ...filters, region })
  )
  const results = await Promise.all(promises)
  return results.flat()
}
