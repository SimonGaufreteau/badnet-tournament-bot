import fs from "node:fs"
import type { AxiosError } from "axios"
import dotenv from "dotenv"
import { validateFilters } from "./check"
import { fetchTournaments } from "./fetch"
import { filterTournaments } from "./filters"
import type { Filters } from "./types/filter-types"

dotenv.config({ quiet: true })

const intervalMinutes = parseInt(process.env.FETCH_INTERVAL_MINUTES || "30", 10)
const outputFile = process.env.OUTPUT_FILE || "tournaments.json"
const outputDir = process.env.OUTPUT_DIR || "out"

const filters: Filters = {
  search: process.env.SEARCH || "",
  region: process.env.REGION || "",
  ageCategories: (process.env.AGE_CATEGORIES || "").split(",").filter(Boolean),
  hideOpenedTournaments: process.env.HIDE_OPENED_TOURNAMENTS === "true",
  hideClosedTournaments: process.env.HIDE_CLOSED_TOURNAMENTS === "true",
}

async function run(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Fetching tournaments...`)

  try {
    const tournaments = await fetchTournaments(filters)
    const filtered = filterTournaments(tournaments, filters)

    fs.mkdirSync(outputDir, { recursive: true })
    fs.writeFileSync(
      `${outputDir}/${outputFile}`,
      JSON.stringify(filtered, null, 2),
    )

    console.log(
      `[${new Date().toISOString()}] Wrote ${filtered.length} tournaments to ${outputFile}`,
    )
  } catch (err) {
    console.error("Error fetching tournaments:", (err as AxiosError).message)
  }
}

const validateResults = validateFilters(filters)
if (validateResults.length > 0) {
  console.error(
    `Filters validation failed. Errors :\n${validateResults.map((res) => res.message).join("\n")}`,
  )
  process.exit(1)
}
run()

setInterval(run, intervalMinutes * 60 * 1000)
