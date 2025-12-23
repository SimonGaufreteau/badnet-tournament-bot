export interface BadnetTournament {
  id: string
  name: string
  onlinepayment: number
  deadline: number
  openline: number
  openline_club: number
  truedeadline: number
  canregister: boolean
  status: number
  isregiopen: boolean
  isregiclose: boolean
  firstday: number
  lastday: number
  docs: unknown[]
  regi_nosingledouble: number
  regi_nosinglemixed: number
  regi_nodoublemixed: number
  organizer: string
  shuttle: string
  place: {
    location: string
    convocplace: string | null
    dpt: number
    sporthalls: unknown[]
  }
  type: {
    id: number
    isteam: boolean
    name: string
  }
  level: {
    id: number
    name: string
  }
  maxplayer: number
  nbrmaxdraw: number
  isfav: boolean
  isregistered: number
  comment: string
  lastnews: string
  info: string
  visitors: number
  website: string | null
  urlaffiche: string
  pointsmin: number
  pointsmax: number
  isbuvette: boolean
  draws: Draw[]
  isliveregistration: boolean
  regideptnumber: number
  regiligueid: number
  regiassoid: number
  catages: Category[]
  disciplines: Discipline[]
  onlylicenced: boolean
  publicschedule: number
  publicplayers: number
  publicdraws: number
  publicconvoc: number
  publicregi: number
  isliveupdate: boolean
  deptnumber: number
  ligueid: number
  mailorga: string
  ispromoted: boolean
}

export interface Draw {
  id: string
  eventid: string
  name: string
  serial: string
  discipline: {
    id: number
    isdouble: boolean
    name: string
    stamp: string
  }
  mincatage: Category
  maxcatage: Category
  catage: Category
  minpoint: number
  maxpoint: number
  minrank: number
  maxrank: number
  minranking: Ranking
  maxranking: Ranking
  isclose: boolean
  stamp: string
  fees: number
}

export interface Category {
  id: number | string
  name: string
  nameshort: string
}

export interface Discipline {
  id: string
  isdouble: boolean
  name: string
  stamp: string
}

export interface Ranking {
  name: string
  id: number
  system: number
  minpoint: number
  minrank: number
  maxpoint: number
  maxrank: number
}
