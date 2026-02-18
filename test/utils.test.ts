import { mapToTournaments } from "../src/fetch"
import { MOCK_RESPONSE } from "./mocks"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

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

describe("TestFormatting", () => {
  it("test date formatting with timezone", () => {
    const timestamp = 1766185200
    const parisDate = dayjs
      .unix(timestamp)
      .tz("Europe/Paris")
      .format("DD/MM/YYYY HH:mm")
    expect(parisDate).toBe("20/12/2025 00:00")
  })
})
