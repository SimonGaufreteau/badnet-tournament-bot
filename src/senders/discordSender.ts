import { Client, GatewayIntentBits, TextChannel } from "discord.js"
import { DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_REGION_CHANNELS } from "../env"
import type { Tournament } from "../types/filter-types"
import type { Sender } from "./sender"
import { formatDates, formatDisciplines, formatLink, formatOpenline, formatRanks } from "../utils/formatters"

export class DiscordSender implements Sender {
  private client: Client
  private ready = false
  private regionChannels: Record<string, string> = {}

  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] })
    this.client.once("ready", () => {
      console.log("Discord bot ready")
      this.ready = true
    })
    this.client.login(DISCORD_TOKEN)

    // Parse region channels: "PDLL:channelid1,AURA:channelid2"
    if (DISCORD_REGION_CHANNELS) {
      DISCORD_REGION_CHANNELS.split(",").forEach(mapping => {
        const [region, channelId] = mapping.split(":")
        if (region && channelId) {
          this.regionChannels[region.trim()] = channelId.trim()
        }
      })
    }
  }

  async send(tournament: Tournament): Promise<void> {
    if (!this.ready) {
      await new Promise(resolve => this.client.once("ready", resolve))
    }

    console.log(`Sending tournament ${tournament.name} to Discord`)
    
    try {
      // Use region-specific channel if available, otherwise fallback to default
      const channelId = (tournament.region && this.regionChannels[tournament.region]) || DISCORD_CHANNEL_ID
      const channel = await this.client.channels.fetch(channelId) as TextChannel
      
      const message = `**Nouveau tournoi : ${tournament.name}**

**Dates du tournoi :** ${formatDates(tournament)}
**Emplacement :** ${tournament.location}
**Ouverture des inscriptions :** ${formatOpenline(tournament)}
**Disciplines :** ${formatDisciplines(tournament)}
**Classements :** ${formatRanks(tournament)}
**Lien :** ${formatLink(tournament)}

Les infos peuvent changer, vérifiez sur le lien ci-dessus !`

      await channel.send(message)
      console.log("Discord message sent")
    } catch (error: any) {
      console.error("Error sending Discord message:", error.message)
      throw error
    }
  }
}
