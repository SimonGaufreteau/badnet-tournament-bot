import axios from "axios"
import { WHATSAPP_API_URL, WHATSAPP_DESTINATION, WHATSAPP_TOKEN } from "../env"
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

const headerName = ""
const formatHeader = (n: string) => n.slice(0, 60 - headerName.length)

export class WhatsAppSender implements Sender {
  async send(tournament: Tournament): Promise<void> {
    logger.info(
      `Sending tournament ${tournament.name} to WhatsApp ${WHATSAPP_DESTINATION}`,
    )
    try {
      const parameters = [
        { type: "text", text: formatDates(tournament) },
        { type: "text", text: tournament.location },
        { type: "text", text: formatOpenline(tournament) },
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

      logger.info(
        "WhatsApp message sent:",
        JSON.stringify(responses.map((r) => r.data)),
      )
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: unknown } }
      logger.error(
        "Error sending WhatsApp message:",
        axiosError.response?.data || (error as Error).message,
      )
      throw error
    }
  }
}
