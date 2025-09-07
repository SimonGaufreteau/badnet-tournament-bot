import { mapToTournaments } from "../src/fetch"
import { MOCK_RESPONSE } from "./mocks"

describe("mapToTournaments ", () => {
  it("should convert the API response to a Tournament object", async () => {
    const result = mapToTournaments(JSON.stringify({ events: [MOCK_RESPONSE] }))
    expect(result[0]).toMatchObject({
      ageCategories: ["Sénior"],
      disciplines: ["SH", "SD", "DH", "DD", "MX"],
      firstDay: 1766185200,
      id: "31568",
      lastDay: 1766357999,
      location: "Cergy",
      maxrank: "R4",
      minrank: "NC",
      name: "Eco-Tournoi de la Grande Horloge",
      openline: 1759341600,
      truedeadline: 1763679540,
      type: { id: 70, isteam: false, name: "Tournoi individuel" },
    })
  })
})
