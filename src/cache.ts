import fs from "node:fs"
import { CACHEFILE } from "./env"
import type { Tournament } from "./types/filter-types"

const cache = new Set<string>()

export const loadCache = (): void => {
  try {
    const data = fs.readFileSync(CACHEFILE, "utf8")
    const ids: string[] = JSON.parse(data)
    ids.forEach((id) => {
      cache.add(id)
    })
  } catch {
    cache.clear()
  }
}

export const filterNewTournaments = (
  tournaments: Tournament[],
): Tournament[] => {
  const newTournaments: Tournament[] = []
  const newIds: string[] = []

  for (const tournament of tournaments) {
    if (!cache.has(tournament.id)) {
      cache.add(tournament.id)
      newTournaments.push(tournament)
      newIds.push(tournament.id)
    }
  }

  if (newIds.length > 0) {
    fs.writeFileSync(CACHEFILE, JSON.stringify([...cache.values()]))
  }

  return newTournaments
}
