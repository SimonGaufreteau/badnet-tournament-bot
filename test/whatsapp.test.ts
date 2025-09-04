import { Tournament } from "../src/types/filter-types"
import { sendWhatsAppTournament } from "../src/whatsappClient"

const SAMPLE_TOURNAMENT = {
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
}

describe("sendWhatsAppTournament", () => {
  it("should send correct payload to WhatsApp API", async () => {
    const result = await sendWhatsAppTournament(
      SAMPLE_TOURNAMENT as unknown as Tournament,
    )
  })
})
