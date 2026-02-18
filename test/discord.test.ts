import type { Tournament } from "../src/types/filter-types"
import { DiscordSender } from "../src/senders/discordSender"

const SAMPLE_TOURNAMENT: Tournament = {
  id: "31955",
  name: "PDLL49-10ème Tournoi des Fouées-Seniors",
  openline: 1756304400,
  truedeadline: 1762815540,
  ageCategories: ["Sénior"],
  disciplines: ["SH", "SD", "DH", "DD", "MX"],
  firstDay: 1763766000,
  lastDay: 1763938799,
  location: "Saint Philbert du Peuple",
  type: {
    id: 70,
    isteam: false,
    name: "Tournoi individuel",
  },
  minrank: "NC",
  maxrank: "R4",
  region: "LIFB",
}

describe("DiscordSender", () => {
  it("should send correct payload to Discord API", async () => {
    const sender = new DiscordSender()
    await sender.send(SAMPLE_TOURNAMENT)
  })
})
