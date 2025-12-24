import Database from "better-sqlite3"
import type { BadnetTournament } from "./types/payload-types"

const DB_PATH = process.env.DATABASE_PATH || "tournaments.db"

class TournamentDatabase {
  private db: Database.Database

  constructor() {
    this.db = new Database(DB_PATH)
    this.initSchema()
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        region TEXT,
        onlinepayment INTEGER,
        deadline INTEGER,
        openline INTEGER,
        openline_club INTEGER,
        truedeadline INTEGER,
        canregister BOOLEAN,
        status INTEGER,
        isregiopen BOOLEAN,
        isregiclose BOOLEAN,
        firstday INTEGER,
        lastday INTEGER,
        organizer TEXT,
        shuttle TEXT,
        location TEXT,
        convocplace TEXT,
        dpt INTEGER,
        type_id INTEGER,
        type_isteam BOOLEAN,
        type_name TEXT,
        level_id INTEGER,
        level_name TEXT,
        maxplayer INTEGER,
        nbrmaxdraw INTEGER,
        isfav BOOLEAN,
        isregistered INTEGER,
        visitors INTEGER,
        website TEXT,
        urlaffiche TEXT,
        pointsmin INTEGER,
        pointsmax INTEGER,
        isbuvette BOOLEAN,
        isliveregistration BOOLEAN,
        regideptnumber INTEGER,
        regiligueid INTEGER,
        regiassoid INTEGER,
        onlylicenced BOOLEAN,
        publicschedule INTEGER,
        publicplayers INTEGER,
        publicdraws INTEGER,
        publicconvoc INTEGER,
        publicregi INTEGER,
        isliveupdate BOOLEAN,
        deptnumber INTEGER,
        ligueid INTEGER,
        mailorga TEXT,
        ispromoted BOOLEAN,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS draws (
        id TEXT PRIMARY KEY,
        tournament_id TEXT NOT NULL,
        eventid TEXT,
        name TEXT,
        serial TEXT,
        discipline_id INTEGER,
        discipline_isdouble BOOLEAN,
        discipline_name TEXT,
        discipline_stamp TEXT,
        mincatage_id TEXT,
        mincatage_name TEXT,
        mincatage_nameshort TEXT,
        maxcatage_id TEXT,
        maxcatage_name TEXT,
        maxcatage_nameshort TEXT,
        catage_id TEXT,
        catage_name TEXT,
        catage_nameshort TEXT,
        minpoint INTEGER,
        maxpoint INTEGER,
        minrank INTEGER,
        maxrank INTEGER,
        minranking_name TEXT,
        minranking_id INTEGER,
        minranking_system INTEGER,
        minranking_minpoint INTEGER,
        minranking_minrank INTEGER,
        minranking_maxpoint INTEGER,
        minranking_maxrank INTEGER,
        maxranking_name TEXT,
        maxranking_id INTEGER,
        maxranking_system INTEGER,
        maxranking_minpoint INTEGER,
        maxranking_minrank INTEGER,
        maxranking_maxpoint INTEGER,
        maxranking_maxrank INTEGER,
        isclose BOOLEAN,
        stamp TEXT,
        fees INTEGER,
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
      );

      CREATE TABLE IF NOT EXISTS categories (
        tournament_id TEXT NOT NULL,
        category_id TEXT NOT NULL,
        name TEXT,
        nameshort TEXT,
        PRIMARY KEY (tournament_id, category_id),
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
      );

      CREATE TABLE IF NOT EXISTS disciplines (
        tournament_id TEXT NOT NULL,
        discipline_id TEXT NOT NULL,
        isdouble BOOLEAN,
        name TEXT,
        stamp TEXT,
        PRIMARY KEY (tournament_id, discipline_id),
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
      );

      CREATE INDEX IF NOT EXISTS idx_tournaments_region ON tournaments(region);
      CREATE INDEX IF NOT EXISTS idx_tournaments_firstday ON tournaments(firstday);
      CREATE INDEX IF NOT EXISTS idx_tournaments_created_at ON tournaments(created_at);
      CREATE INDEX IF NOT EXISTS idx_draws_tournament_id ON draws(tournament_id);
      CREATE INDEX IF NOT EXISTS idx_categories_tournament_id ON categories(tournament_id);
      CREATE INDEX IF NOT EXISTS idx_disciplines_tournament_id ON disciplines(tournament_id);
    `)
  }

  saveTournament(tournament: BadnetTournament, region?: string): void {
    const transaction = this.db.transaction(() => {
      // Insert main tournament
      const tournamentStmt = this.db.prepare(`
        INSERT OR REPLACE INTO tournaments (
          id, name, region, onlinepayment, deadline, openline, openline_club, truedeadline,
          canregister, status, isregiopen, isregiclose, firstday, lastday, organizer, shuttle,
          location, convocplace, dpt, type_id, type_isteam, type_name, level_id, level_name,
          maxplayer, nbrmaxdraw, isfav, isregistered, visitors,
          website, urlaffiche, pointsmin, pointsmax, isbuvette, isliveregistration,
          regideptnumber, regiligueid, regiassoid, onlylicenced, publicschedule, publicplayers,
          publicdraws, publicconvoc, publicregi, isliveupdate, deptnumber, ligueid, mailorga, ispromoted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      tournamentStmt.run(
        tournament.id,
        tournament.name,
        region,
        tournament.onlinepayment,
        tournament.deadline,
        tournament.openline,
        tournament.openline_club,
        tournament.truedeadline,
        tournament.canregister ? 1 : 0,
        tournament.status,
        tournament.isregiopen ? 1 : 0,
        tournament.isregiclose ? 1 : 0,
        tournament.firstday,
        tournament.lastday,
        tournament.organizer,
        tournament.shuttle,
        tournament.place.location,
        tournament.place.convocplace,
        tournament.place.dpt,
        tournament.type.id,
        tournament.type.isteam ? 1 : 0,
        tournament.type.name,
        tournament.level.id,
        tournament.level.name,
        tournament.maxplayer,
        tournament.nbrmaxdraw,
        tournament.isfav ? 1 : 0,
        tournament.isregistered,
        tournament.visitors,
        tournament.website,
        tournament.urlaffiche,
        tournament.pointsmin,
        tournament.pointsmax,
        tournament.isbuvette ? 1 : 0,
        tournament.isliveregistration ? 1 : 0,
        tournament.regideptnumber,
        tournament.regiligueid,
        tournament.regiassoid,
        tournament.onlylicenced ? 1 : 0,
        tournament.publicschedule,
        tournament.publicplayers,
        tournament.publicdraws,
        tournament.publicconvoc,
        tournament.publicregi,
        tournament.isliveupdate ? 1 : 0,
        tournament.deptnumber,
        tournament.ligueid,
        tournament.mailorga,
        tournament.ispromoted ? 1 : 0,
      )

      // Clear existing related data
      this.db
        .prepare("DELETE FROM draws WHERE tournament_id = ?")
        .run(tournament.id)
      this.db
        .prepare("DELETE FROM categories WHERE tournament_id = ?")
        .run(tournament.id)
      this.db
        .prepare("DELETE FROM disciplines WHERE tournament_id = ?")
        .run(tournament.id)

      // Insert draws
      const drawStmt = this.db.prepare(`
        INSERT INTO draws (
          id, tournament_id, eventid, name, serial, discipline_id, discipline_isdouble,
          discipline_name, discipline_stamp, mincatage_id, mincatage_name, mincatage_nameshort,
          maxcatage_id, maxcatage_name, maxcatage_nameshort, catage_id, catage_name,
          catage_nameshort, minpoint, maxpoint, minrank, maxrank, minranking_name,
          minranking_id, minranking_system, minranking_minpoint, minranking_minrank,
          minranking_maxpoint, minranking_maxrank, maxranking_name, maxranking_id,
          maxranking_system, maxranking_minpoint, maxranking_minrank, maxranking_maxpoint,
          maxranking_maxrank, isclose, stamp, fees
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      for (const draw of tournament.draws) {
        drawStmt.run(
          draw.id,
          tournament.id,
          draw.eventid,
          draw.name,
          draw.serial,
          draw.discipline.id,
          draw.discipline.isdouble ? 1 : 0,
          draw.discipline.name,
          draw.discipline.stamp,
          draw.mincatage.id,
          draw.mincatage.name,
          draw.mincatage.nameshort,
          draw.maxcatage.id,
          draw.maxcatage.name,
          draw.maxcatage.nameshort,
          draw.catage.id,
          draw.catage.name,
          draw.catage.nameshort,
          draw.minpoint,
          draw.maxpoint,
          draw.minrank,
          draw.maxrank,
          draw.minranking.name,
          draw.minranking.id,
          draw.minranking.system,
          draw.minranking.minpoint,
          draw.minranking.minrank,
          draw.minranking.maxpoint,
          draw.minranking.maxrank,
          draw.maxranking.name,
          draw.maxranking.id,
          draw.maxranking.system,
          draw.maxranking.minpoint,
          draw.maxranking.minrank,
          draw.maxranking.maxpoint,
          draw.maxranking.maxrank,
          draw.isclose ? 1 : 0,
          draw.stamp,
          draw.fees,
        )
      }

      // Insert categories
      const categoryStmt = this.db.prepare(`
        INSERT INTO categories (tournament_id, category_id, name, nameshort)
        VALUES (?, ?, ?, ?)
      `)
      for (const category of tournament.catages) {
        categoryStmt.run(
          tournament.id,
          category.id,
          category.name,
          category.nameshort,
        )
      }

      // Insert disciplines
      const disciplineStmt = this.db.prepare(`
        INSERT INTO disciplines (tournament_id, discipline_id, isdouble, name, stamp)
        VALUES (?, ?, ?, ?, ?)
      `)
      for (const discipline of tournament.disciplines) {
        disciplineStmt.run(
          tournament.id,
          discipline.id,
          discipline.isdouble ? 1 : 0,
          discipline.name,
          discipline.stamp,
        )
      }
    })

    transaction()
  }

  getTournamentById(id: string): BadnetTournament | null {
    const tournamentStmt = this.db.prepare(`
      SELECT * FROM tournaments WHERE id = ?
    `)
    const tournament = tournamentStmt.get(id) as any

    if (!tournament) return null

    // Get related data
    const draws = this.db
      .prepare("SELECT * FROM draws WHERE tournament_id = ?")
      .all(id) as any[]
    const categories = this.db
      .prepare("SELECT * FROM categories WHERE tournament_id = ?")
      .all(id) as any[]
    const disciplines = this.db
      .prepare("SELECT * FROM disciplines WHERE tournament_id = ?")
      .all(id) as any[]

    // Reconstruct BadnetTournament object
    return {
      id: tournament.id,
      name: tournament.name,
      onlinepayment: tournament.onlinepayment,
      deadline: tournament.deadline,
      openline: tournament.openline,
      openline_club: tournament.openline_club,
      truedeadline: tournament.truedeadline,
      canregister: tournament.canregister === 1,
      status: tournament.status,
      isregiopen: tournament.isregiopen === 1,
      isregiclose: tournament.isregiclose === 1,
      firstday: tournament.firstday,
      lastday: tournament.lastday,
      docs: [],
      regi_nosingledouble: 0,
      regi_nosinglemixed: 0,
      regi_nodoublemixed: 0,
      organizer: tournament.organizer,
      shuttle: tournament.shuttle,
      place: {
        location: tournament.location,
        convocplace: tournament.convocplace,
        dpt: tournament.dpt,
        sporthalls: [],
      },
      type: {
        id: tournament.type_id,
        isteam: tournament.type_isteam === 1,
        name: tournament.type_name,
      },
      level: {
        id: tournament.level_id,
        name: tournament.level_name,
      },
      maxplayer: tournament.maxplayer,
      nbrmaxdraw: tournament.nbrmaxdraw,
      isfav: tournament.isfav === 1,
      isregistered: tournament.isregistered,
      comment: '',
      lastnews: '',
      info: '',
      visitors: tournament.visitors,
      website: tournament.website,
      urlaffiche: tournament.urlaffiche,
      pointsmin: tournament.pointsmin,
      pointsmax: tournament.pointsmax,
      isbuvette: tournament.isbuvette === 1,
      draws: draws.map((d) => ({
        id: d.id,
        eventid: d.eventid,
        name: d.name,
        serial: d.serial,
        discipline: {
          id: d.discipline_id,
          isdouble: d.discipline_isdouble === 1,
          name: d.discipline_name,
          stamp: d.discipline_stamp,
        },
        mincatage: {
          id: d.mincatage_id,
          name: d.mincatage_name,
          nameshort: d.mincatage_nameshort,
        },
        maxcatage: {
          id: d.maxcatage_id,
          name: d.maxcatage_name,
          nameshort: d.maxcatage_nameshort,
        },
        catage: {
          id: d.catage_id,
          name: d.catage_name,
          nameshort: d.catage_nameshort,
        },
        minpoint: d.minpoint,
        maxpoint: d.maxpoint,
        minrank: d.minrank,
        maxrank: d.maxrank,
        minranking: {
          name: d.minranking_name,
          id: d.minranking_id,
          system: d.minranking_system,
          minpoint: d.minranking_minpoint,
          minrank: d.minranking_minrank,
          maxpoint: d.minranking_maxpoint,
          maxrank: d.minranking_maxrank,
        },
        maxranking: {
          name: d.maxranking_name,
          id: d.maxranking_id,
          system: d.maxranking_system,
          minpoint: d.maxranking_minpoint,
          minrank: d.maxranking_minrank,
          maxpoint: d.maxranking_maxpoint,
          maxrank: d.maxranking_maxrank,
        },
        isclose: d.isclose === 1,
        stamp: d.stamp,
        fees: d.fees,
      })),
      isliveregistration: tournament.isliveregistration === 1,
      regideptnumber: tournament.regideptnumber,
      regiligueid: tournament.regiligueid,
      regiassoid: tournament.regiassoid,
      catages: categories.map((c) => ({
        id: c.category_id,
        name: c.name,
        nameshort: c.nameshort,
      })),
      disciplines: disciplines.map((d) => ({
        id: d.discipline_id,
        isdouble: d.isdouble === 1,
        name: d.name,
        stamp: d.stamp,
      })),
      onlylicenced: tournament.onlylicenced === 1,
      publicschedule: tournament.publicschedule,
      publicplayers: tournament.publicplayers,
      publicdraws: tournament.publicdraws,
      publicconvoc: tournament.publicconvoc,
      publicregi: tournament.publicregi,
      isliveupdate: tournament.isliveupdate === 1,
      deptnumber: tournament.deptnumber,
      ligueid: tournament.ligueid,
      mailorga: tournament.mailorga,
      ispromoted: tournament.ispromoted === 1,
    }
  }

  tournamentExists(id: string): boolean {
    const stmt = this.db.prepare(
      "SELECT 1 FROM tournaments WHERE id = ? LIMIT 1",
    )
    return stmt.get(id) !== undefined
  }

  close(): void {
    this.db.close()
  }
}

export const tournamentDb = new TournamentDatabase()
