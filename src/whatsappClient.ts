import axios from "axios"
import dayjs from "dayjs"
import {
  WHATSAPP_API_URL,
  WHATSAPP_APP_ID,
  WHATSAPP_DESTINATION,
  WHATSAPP_TOKEN,
} from "./env"
import type { Tournament } from "./types/filter-types"

const DATE_FORMAT = "DD/MM/YYYY"

const formatUnix = (u: number) => dayjs.unix(u).format(DATE_FORMAT)

const formatDates = (t: Tournament) =>
  `du ${formatUnix(t.firstDay)} au ${formatUnix(t.lastDay)}`

const formatDisciplines = (t: Tournament) => t.disciplines.join(" / ")

const formatRanks = (t: Tournament) => `de ${t.minrank} à ${t.maxrank}`

const formatLink = (t: Tournament) =>
  `https://badnet.fr/tournoi/public?eventid=${t.id}`

export const sendWhatsAppTournament = async (tournament: Tournament) => {
  try {
    console.log(`ID : ${WHATSAPP_APP_ID}`)
    const parameters = [
      { type: "text", text: formatDates(tournament) },
      { type: "text", text: tournament.location },
      { type: "text", text: formatUnix(tournament.openline) },
      { type: "text", text: formatDisciplines(tournament) },
      { type: "text", text: formatLink(tournament) },
      { type: "text", text: formatRanks(tournament) },
    ]
    console.log(JSON.stringify(tournament))
    // TODO : Put actual values and pass the tournament as a parameter
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: WHATSAPP_DESTINATION,
        type: "template",
        template: {
          name: "badnetlink",
          language: { code: "fr" },
          components: [
            {
              type: "header",
              parameters: [{ type: "text", text: tournament.name }],
            },
            {
              type: "body",
              parameters,
            },
            // {
            //   type: "button",
            //   sub_type: "url",
            //   index: "0",
            //   parameters: [{ type: "text", text: tournament.id }],
            // },
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

    console.log("Message sent:", response.data)
    return response.data
  } catch (error: any) {
    console.error(
      "Error sending WhatsApp message:",
      error.response?.data || error.message,
    )
    throw error
  }
}
