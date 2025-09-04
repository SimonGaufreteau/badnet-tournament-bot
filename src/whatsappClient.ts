import axios from "axios"
import dayjs from "dayjs"
import { Tournament } from "./types/filter-types"

const WHATSAPP_APP_ID = process.env.WHATSAPP_APP_ID || ""
const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_APP_ID}/messages`
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || ""
const WHATSAPP_DESTINATION = process.env.WHATSAPP_DESTINATION || ""

const DATE_FORMAT = "DD/MM/YYYY"

const formatUnix = (u: number) => dayjs.unix(u).format(DATE_FORMAT)

const formatDates = (t: Tournament) =>
  `du ${formatUnix(t.firstDay)} au ${formatUnix(t.lastDay)}`

const formatDisciplines = (t: Tournament) => t.disciplines.join(" / ")

const formatLink = (t: Tournament) =>
  `https://badnet.fr/tournoi/public?eventid=${t.id}`

export async function sendWhatsAppTournament(tournament: Tournament) {
  try {
    console.log(`ID : ${WHATSAPP_APP_ID}`)
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
              parameters: [
                { type: "text", text: formatDates(tournament) },
                { type: "text", text: tournament.location },
                { type: "text", text: formatUnix(tournament.openline) },
                { type: "text", text: formatDisciplines(tournament) },
                { type: "text", text: formatLink(tournament) },
              ],
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
