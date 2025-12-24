import fs from "node:fs"
import type { AxiosError } from "axios"
import { filterNewTournaments, loadCache } from "./cache"
import { validateFilters } from "./check"
import {
  DISCORD_REGION_CHANNELS,
  FILTERS,
  INTERVALMINUTES,
  OUTPUTDIR,
} from "./env"
import { fetchTournaments, fetchTournamentsForRegions } from "./fetch"
import { filterTournaments } from "./filters"
import { logger } from "./logger"
import { DiscordSender } from "./senders/discordSender"
import type { Sender } from "./senders/sender"
import { WhatsAppSender } from "./senders/whatsappSender"
import type { Tournament } from "./types/filter-types"

const senders: Sender[] = []

// Initialize senders based on environment variables
if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_DESTINATION) {
  senders.push(new WhatsAppSender())
}

if (process.env.DISCORD_TOKEN && process.env.DISCORD_CHANNEL_ID) {
  senders.push(new DiscordSender())
}

const run = async (): Promise<void> => {
  logger.info("Fetching tournaments...")

  try {
    let tournaments: Tournament[] = []

    // If Discord region channels are configured, fetch for all regions
    if (DISCORD_REGION_CHANNELS) {
      const regions = DISCORD_REGION_CHANNELS.split(",").map((mapping) =>
        mapping.split(":")[0].trim(),
      )
      tournaments = await fetchTournamentsForRegions(FILTERS, regions)
    } else {
      tournaments = await fetchTournaments(FILTERS)
    }

    const filtered = filterTournaments(tournaments, FILTERS)
    const newTournaments = filterNewTournaments(filtered)

    if (newTournaments.length > 0) {
      fs.mkdirSync(OUTPUTDIR, { recursive: true })
      const timestamp = new Date().toISOString()
      const logEntry = { [timestamp]: newTournaments.map((t) => t.id) }
      fs.appendFileSync(
        `${OUTPUTDIR}/new-tournaments.log`,
        `${JSON.stringify(logEntry)}\n`,
      )
      fs.appendFileSync(
        `${OUTPUTDIR}/full-new-tournaments.log`,
        `${JSON.stringify(newTournaments)}\n`,
      )
    }

    logger.info(
      `Found ${newTournaments.length} new tournaments (${filtered.length} total)`,
    )

    const sendPromises = newTournaments.flatMap((tournament) =>
      senders.map((sender) => sender.send(tournament)),
    )
    await Promise.all(sendPromises)
    logger.info("Process completed. Waiting for next run.")
  } catch (err) {
    logger.error("Error fetching tournaments:", (err as AxiosError).message)
  }
}

const validateResults = validateFilters(FILTERS)
if (validateResults.length > 0) {
  logger.error(
    `Filters validation failed. Errors :\n${validateResults.map((res) => res.message).join("\n")}`,
  )
  process.exit(1)
}

loadCache()
run()

const interval = INTERVALMINUTES
logger.info(`Starting run every ${interval} minutes`)
setInterval(run, interval * 60 * 1000)
