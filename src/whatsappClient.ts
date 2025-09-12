import axios from "axios"
import dayjs from "dayjs"
import { WHATSAPP_API_URL, WHATSAPP_DESTINATION, WHATSAPP_TOKEN } from "./env"
import type { Tournament } from "./types/filter-types"

const DATE_FORMAT = "DD/MM/YYYY"

const formatUnix = (u: number) => dayjs.unix(u).format(DATE_FORMAT)

const headerName = "" //"Nouveau tournoi : "
const formatHeader = (n: string) => n.slice(0, 60 - headerName.length)

const formatDates = (t: Tournament) =>
  `du ${formatUnix(t.firstDay)} au ${formatUnix(t.lastDay)}`

const formatDisciplines = (t: Tournament) => t.disciplines.join(" / ")

const formatRanks = (t: Tournament) => `de ${t.minrank} à ${t.maxrank}`

const formatLink = (t: Tournament) =>
  `https://badnet.fr/tournoi/public?eventid=${t.id}`

export const sendWhatsAppTournament = async (tournament: Tournament) => {
  console.log(
    `Sending tournament ${tournament.name} to ${WHATSAPP_DESTINATION}`,
  )
  try {
    const parameters = [
      { type: "text", text: formatDates(tournament) },
      { type: "text", text: tournament.location },
      { type: "text", text: formatUnix(tournament.openline) },
      { type: "text", text: formatDisciplines(tournament) },
      { type: "text", text: formatLink(tournament) },
      { type: "text", text: formatRanks(tournament) },
    ]
    const sendMessage = (destination: string) =>
      axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: "whatsapp",
          to: destination,
          type: "template",
          template: {
            name: "badnetlink",
            language: { code: "fr" },
            components: [
              {
                type: "header",
                parameters: [
                  { type: "text", text: formatHeader(tournament.name) },
                ],
              },
              {
                type: "body",
                parameters,
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      )
    const promises = WHATSAPP_DESTINATION.map(sendMessage)
    const responses = await Promise.all(promises)

    console.log("Message sent:", JSON.stringify(responses.map((r) => r.data)))
    return responses
  } catch (error: any) {
    console.error(
      "Error sending WhatsApp message:",
      error.response?.data || error.message,
    )
    throw error
  }
}
