import fs from "node:fs"
import type { AxiosError } from "axios"
import { filterNewTournaments, loadCache } from "./cache"
import { validateFilters } from "./check"
import { FILTERS, INTERVALMINUTES, OUTPUTDIR } from "./env"
import { fetchTournaments } from "./fetch"
import { filterTournaments } from "./filters"
import { sendWhatsAppTournament } from "./whatsappClient"

const run = async (): Promise<void> => {
  console.log(`[${new Date().toISOString()}] Fetching tournaments...`)

  try {
    const tournaments = await fetchTournaments(FILTERS)
    const filtered = filterTournaments(tournaments, FILTERS)
    const newTournaments = filterNewTournaments(filtered)

    if (newTournaments.length > 0) {
      fs.mkdirSync(OUTPUTDIR, { recursive: true })
      const timestamp = new Date().toISOString()
      const logEntry = { [timestamp]: newTournaments.map((t) => t.id) }
      fs.appendFileSync(
        `${OUTPUTDIR}/new-tournaments.log`,
        JSON.stringify(logEntry) + "\n",
      )
    }

    console.log(
      `[${new Date().toISOString()}] Found ${newTournaments.length} new tournaments (${filtered.length} total)`,
    )
    const whatasappPromises = newTournaments.map((t) =>
      sendWhatsAppTournament(t),
    )
    const result = await Promise.all(whatasappPromises)
    if (result.length > 0) {
      console.log(`Sent to whatsapp : ${JSON.stringify(result)}`)
    }
  } catch (err) {
    console.error("Error fetching tournaments:", (err as AxiosError).message)
  }
}

const validateResults = validateFilters(FILTERS)
if (validateResults.length > 0) {
  console.error(
    `Filters validation failed. Errors :\n${validateResults.map((res) => res.message).join("\n")}`,
  )
  process.exit(1)
}

loadCache()
run()

const interval = INTERVALMINUTES
console.info(`Starting run every ${interval} minutes`)
setInterval(run, interval * 60 * 1000)
