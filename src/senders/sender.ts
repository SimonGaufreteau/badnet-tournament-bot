import type { Tournament } from "../types/filter-types"

export interface Sender {
  send(tournament: Tournament): Promise<void>
}
