import axios from "axios"
import {
  BADNETORIGIN,
  BADNETTOKEN,
  PAGELIMIT,
  REGION_FETCH_DELAY_SECONDS,
} from "./env"
import { tournamentDb } from "./database"
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

export const mapToTournaments = (
  data: string,
  region?: string,
): Tournament[] => {
  const parsed: { events: BadnetTournament[] } = JSON.parse(data)
  
  // Save raw tournaments to database
  for (const event of parsed.events) {
    if (!tournamentDb.tournamentExists(event.id)) {
      tournamentDb.saveTournament(event, region)
    }
  }
  
  return parsed.events.map((event: BadnetTournament) => {
    // Debug missing ranking data
    const hasInvalidDraws = event.draws.some(
      (d) => !d.minranking?.name || !d.maxranking?.name,
    )
    if (hasInvalidDraws) {
      console.warn(
        `Tournament ${event.name} in ${region} has invalid ranking data`,
      )
    }

    return {
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
      minrank:
        event.draws
          .map((d) => ({
            name: d.minranking?.name || "NC",
            value: RANKINGS[d.minranking?.name] || RANKINGS.NC,
          }))
          .sort((a, b) => b.value - a.value)[0]?.name || "NC",
      maxrank:
        event.draws
          .map((d) => ({
            name: d.maxranking?.name || "NC",
            value: RANKINGS[d.maxranking?.name] || RANKINGS.NC,
          }))
          .sort((a, b) => a.value - b.value)[0]?.name || "NC",
      region,
    }
  })
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
  const allTournaments: Tournament[] = []

  for (const region of regions) {
    console.log(`Fetching tournaments for region: ${region}`)
    const tournaments = await fetchTournaments({ ...filters, region })
    allTournaments.push(...tournaments)

    // Wait before next region (except for the last one)
    if (region !== regions[regions.length - 1]) {
      console.log(
        `Waiting ${REGION_FETCH_DELAY_SECONDS} seconds before next region...`,
      )
      await new Promise((resolve) =>
        setTimeout(resolve, REGION_FETCH_DELAY_SECONDS * 1000),
      )
    }
  }

  return allTournaments
}
