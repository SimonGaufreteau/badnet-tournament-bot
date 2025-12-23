import { FILTERS } from "../src/env"
import { fetchTournaments, fetchTournamentsForRegions } from "../src/fetch"
import { filterTournaments } from "../src/filters"

describe("Badnet API Tests", () => {
  it("should fetch tournaments from single region", async () => {
    const tournaments = await fetchTournaments({ ...FILTERS, region: "AURA" })

    expect(Array.isArray(tournaments)).toBe(true)
    console.log(`Found ${tournaments.length} tournaments in PDLL`)

    if (tournaments.length > 0) {
      expect(tournaments[0]).toHaveProperty("name")
      expect(tournaments[0]).toHaveProperty("location")
      console.log("Sample tournament:", tournaments[0].name)
    }
  })

  it("should fetch tournaments from multiple regions", async () => {
    const tournaments = await fetchTournamentsForRegions(FILTERS, [
      "PDLL",
      "PACA",
    ])

    expect(Array.isArray(tournaments)).toBe(true)
    console.log(`Found ${tournaments.length} tournaments total`)

    const regions = tournaments.map((t) => t.region).filter(Boolean)
    expect(regions).toContain("PDLL")
    expect(regions).toContain("PACA")
  })

  it("should apply filters correctly", async () => {
    const tournaments = await fetchTournaments({ ...FILTERS, region: "PDLL" })
    const filtered = filterTournaments(tournaments, FILTERS)

    expect(filtered.length).toBeLessThanOrEqual(tournaments.length)
    console.log(`${tournaments.length} -> ${filtered.length} after filtering`)
  })
})
