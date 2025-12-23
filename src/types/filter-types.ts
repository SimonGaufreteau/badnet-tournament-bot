export type Tournament = {
  id: string
  name: string
  ageCategories: string[]
  disciplines: string[]
  firstDay: number
  lastDay: number
  location: string
  type: { id: number; isteam: boolean; name: string }
  openline: number
  truedeadline: number
  minrank: string
  maxrank: string
  region?: string
}

export type Filters = {
  search: string
  region: string
  ageCategories: string[]
  hideOpenedTournaments: boolean
  hideClosedTournaments: boolean
}
