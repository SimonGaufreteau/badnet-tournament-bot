import { mapToTournaments } from "../src/fetch"
import { MOCK_RESPONSE } from "./mocks"

describe("mapToTournaments ", () => {
  it("should convert the API response to a Tournament object", async () => {
    const result = mapToTournaments(JSON.stringify({ events: [MOCK_RESPONSE] }))
    expect(result[0]).toMatchObject({
      ageCategories: ["Sénior"],
      disciplines: ["SH", "SD", "DH", "DD", "MX"],
      firstDay: 1761343200,
      id: "31369",
      lastDay: 1761519599,
      location: "Cholet",
      maxrank: "R4",
      minrank: "P10",
      name: "31369",
      openline: 1756702800,
      truedeadline: 1760126400,
      type: { id: 70, isteam: false, name: "Tournoi individuel" },
    })
  })
})
