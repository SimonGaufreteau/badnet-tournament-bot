import { Client, GatewayIntentBits, type TextChannel } from "discord.js"
import {
  DISCORD_CHANNEL_ID,
  DISCORD_REGION_CHANNELS,
  DISCORD_TOKEN,
} from "../env"
import { logger } from "../logger"
import type { Tournament } from "../types/filter-types"
import {
  formatDates,
  formatDisciplines,
  formatLink,
  formatOpenline,
  formatRanks,
} from "../utils/formatters"
import type { Sender } from "./sender"

const formatDiscordMessage = (tournament: Tournament): string => {
  return `*Nouveau tournoi : ${tournament.name}*

🗓 *Dates* : ${formatDates(tournament)}
📍 *Lieu* : ${tournament.location}
🕐 *Ouverture* : ${formatOpenline(tournament)}
🏸 *Tableaux* : ${formatDisciplines(tournament)}
📈 *Classements* : ${formatRanks(tournament)}
🔗 *Lien* : ${formatLink(tournament)}

Les infos peuvent changer, vérifiez sur le lien ci-dessus !`
}

export class DiscordSender implements Sender {
  private client: Client
  private ready = false
  private regionChannels: Record<string, string> = {}

  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] })
    this.client.once("clientReady", () => {
      logger.info("Discord bot ready")
      this.ready = true
    })
    this.client.login(DISCORD_TOKEN)

    // Parse region channels: "PDLL:channelid1,AURA:channelid2"
    if (DISCORD_REGION_CHANNELS) {
      DISCORD_REGION_CHANNELS.split(",").forEach((mapping) => {
        const [region, channelId] = mapping.split(":")
        if (region && channelId) {
          this.regionChannels[region.trim()] = channelId.trim()
        }
      })
    }
  }

  async send(tournament: Tournament): Promise<void> {
    if (!this.ready) {
      await new Promise((resolve) => this.client.once("clientReady", resolve))
    }

    logger.info(`Sending tournament ${tournament.name} to Discord`)

    try {
      // Use region-specific channel if available, otherwise fallback to default
      const channelId =
        (tournament.region && this.regionChannels[tournament.region]) ||
        DISCORD_CHANNEL_ID
      const channel = (await this.client.channels.fetch(
        channelId,
      )) as TextChannel

      const message = formatDiscordMessage(tournament)

      await channel.send(message)
      logger.info("Discord message sent")
    } catch (error: unknown) {
      logger.error("Error sending Discord message:", (error as Error).message)
      throw error
    }
  }
}
