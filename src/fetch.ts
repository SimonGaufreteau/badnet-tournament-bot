import axios from "axios"
import type { Filters, Tournament } from "./types/filter-types"
import type { BadnetTournament } from "./types/payload-types"

const pageLimit = parseInt(process.env.PAGE_LIMIT || "50", 10)

const mapToTournaments = (data: string): Tournament[] => {
  const parsed: { events: BadnetTournament[] } = JSON.parse(data)
  return parsed.events.map((event: BadnetTournament) => ({
    id: event.id,
    name: event.name,
    openline: event.openline,
    truedeadline: event.truedeadline,
    ageCategories: event.catages.map((c) => c.name),
    disciplines: event.disciplines,
    firstDay: event.firstday,
    lastDay: event.lastday,
    location: event.place.location,
    type: {
      id: event.type.id,
      isteam: event.type.isteam,
      name: event.type.name,
    },
  }))
}

export const fetchTournaments = async (
  filters: Filters,
): Promise<Tournament[]> => {
  let offset = 0
  let allTournaments: Tournament[] = []
  console.log(`Fetching with limit : ${pageLimit}`)

  while (true) {
    // TODO : Write the
    const response = await axios.get<Tournament[]>(
      process.env.BADNET_API_URL as string,
      {
        headers: {
          "x-badnet-origin": process.env.BADNET_ORIGIN,
          "x-badnet-token": process.env.BADNET_TOKEN,
        },
        params: {
          iswithpast: false,
          ligue: filters.region,
          limit: pageLimit,
          offset,
          type: "70",
          what: filters.search,
        },
        transformResponse: mapToTournaments,
      },
    )

    const tournaments = response.data
    if (!tournaments.length) break

    allTournaments = allTournaments.concat(tournaments)

    offset += pageLimit
  }

  return allTournaments
}
