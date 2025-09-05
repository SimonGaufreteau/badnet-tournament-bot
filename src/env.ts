import dotenv from "dotenv"
import type { Filters } from "./types/filter-types"

dotenv.config({ quiet: true })
const OUTPUTDIR = process.env.OUTPUT_DIR || "out"

const CACHEFILE = process.env.CACHE_FILE || "cache.json"
const PAGELIMIT = parseInt(process.env.PAGE_LIMIT || "50", 10)
const INTERVALMINUTES = parseInt(process.env.FETCH_INTERVAL_MINUTES || "30", 10)
export const FILTERS: Filters = {
  search: process.env.SEARCH || "",
  region: process.env.REGION || "",
  ageCategories: (process.env.AGE_CATEGORIES || "").split(",").filter(Boolean),
  hideOpenedTournaments: process.env.HIDE_OPENED_TOURNAMENTS === "true",
  hideClosedTournaments: process.env.HIDE_CLOSED_TOURNAMENTS === "true",
}

const WHATSAPP_APP_ID = process.env.WHATSAPP_APP_ID || ""
const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_APP_ID}/messages`
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || ""
const WHATSAPP_DESTINATION = process.env.WHATSAPP_DESTINATION || ""

const BADNETAPIURL = process.env.BADNET_API_URL || ""
const BADNETORIGIN = process.env.BADNET_ORIGIN
const BADNETTOKEN = process.env.BADNET_TOKEN

export {
  OUTPUTDIR,
  CACHEFILE,
  PAGELIMIT,
  INTERVALMINUTES,
  BADNETAPIURL,
  BADNETORIGIN,
  BADNETTOKEN,
  WHATSAPP_TOKEN,
  WHATSAPP_APP_ID,
  WHATSAPP_API_URL,
  WHATSAPP_DESTINATION,
}
