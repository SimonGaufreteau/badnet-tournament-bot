import fs from "fs"
import path from "path"
import { tournamentDb } from "../src/database"
import type { BadnetTournament } from "../src/types/payload-types"

describe("Database Tests", () => {
  const testDbPath = "test-tournaments.db"

  beforeAll(() => {
    // Use test database
    process.env.DATABASE_PATH = testDbPath
  })

  afterAll(() => {
    // Clean up test database
    tournamentDb.close()
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
  })

  beforeEach(() => {
    // Clear database before each test
    const db = (tournamentDb as any).db
    db.exec("DELETE FROM draws")
    db.exec("DELETE FROM categories")
    db.exec("DELETE FROM disciplines")
    db.exec("DELETE FROM tournaments")
  })

  it("should save and retrieve tournament from examples/tournaments.json", () => {
    // Load example data
    const examplePath = path.join(__dirname, "../examples/tournaments.json")
    const tournaments: BadnetTournament[] = JSON.parse(
      fs.readFileSync(examplePath, "utf8"),
    )

    expect(tournaments.length).toBeGreaterThan(0)

    const tournament = tournaments[0]
    const region = "PDLL"

    // Save tournament
    tournamentDb.saveTournament(tournament, region)

    // Verify it exists
    expect(tournamentDb.tournamentExists(tournament.id)).toBe(true)

    // Retrieve and verify
    const retrieved = tournamentDb.getTournamentById(tournament.id)

    expect(retrieved).not.toBeNull()
    expect(retrieved!.id).toBe(tournament.id)
    expect(retrieved!.name).toBe(tournament.name)
    expect(retrieved!.organizer).toBe(tournament.organizer)
    expect(retrieved!.place.location).toBe(tournament.place.location)
    expect(retrieved!.type.name).toBe(tournament.type.name)
    expect(retrieved!.level.name).toBe(tournament.level.name)

    // Verify arrays
    expect(retrieved!.draws).toHaveLength(tournament.draws.length)
    expect(retrieved!.catages).toHaveLength(tournament.catages.length)
    expect(retrieved!.disciplines).toHaveLength(tournament.disciplines.length)

    // Verify first draw details
    if (tournament.draws.length > 0) {
      const originalDraw = tournament.draws[0]
      const retrievedDraw = retrieved!.draws[0]

      expect(retrievedDraw.id).toBe(originalDraw.id)
      expect(retrievedDraw.name).toBe(originalDraw.name)
      expect(retrievedDraw.discipline.name).toBe(originalDraw.discipline.name)
      expect(retrievedDraw.minranking.name).toBe(originalDraw.minranking.name)
      expect(retrievedDraw.maxranking.name).toBe(originalDraw.maxranking.name)
    }
  })

  it("should handle multiple tournaments from examples", () => {
    const examplePath = path.join(__dirname, "../examples/tournaments.json")
    const tournaments: BadnetTournament[] = JSON.parse(
      fs.readFileSync(examplePath, "utf8"),
    )

    // Save first 3 tournaments
    const testTournaments = tournaments.slice(0, 3)

    testTournaments.forEach((tournament, index) => {
      tournamentDb.saveTournament(tournament, `REGION_${index}`)
    })

    // Verify all exist
    testTournaments.forEach((tournament) => {
      expect(tournamentDb.tournamentExists(tournament.id)).toBe(true)

      const retrieved = tournamentDb.getTournamentById(tournament.id)
      expect(retrieved).not.toBeNull()
      expect(retrieved!.id).toBe(tournament.id)
    })
  })

  it("should handle tournament updates (INSERT OR REPLACE)", () => {
    const examplePath = path.join(__dirname, "../examples/tournaments.json")
    const tournaments: BadnetTournament[] = JSON.parse(
      fs.readFileSync(examplePath, "utf8"),
    )
    const tournament = tournaments[0]

    // Save original
    tournamentDb.saveTournament(tournament, "PDLL")

    // Modify and save again
    const modified = { ...tournament, name: "Modified Tournament Name" }
    tournamentDb.saveTournament(modified, "AURA")

    // Should still exist only once with updated data
    expect(tournamentDb.tournamentExists(tournament.id)).toBe(true)

    const retrieved = tournamentDb.getTournamentById(tournament.id)
    expect(retrieved!.name).toBe("Modified Tournament Name")
  })
})
